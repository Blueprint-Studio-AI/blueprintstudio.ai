// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';
import { validateEmail } from '@/lib/validation'; // Import the validation function

export const runtime = 'edge';

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_REQUESTS = 5;
const ipRequests = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = ipRequests.get(ip);

  if (!userRequests || (now - userRequests.timestamp) > RATE_LIMIT_WINDOW) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userRequests.count >= MAX_REQUESTS) {
    return false;
  }

  userRequests.count += 1;
  return true;
}

export async function POST(request: Request) {
    try {
      // Rate limiting
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || 'unknown';
      
      if (!checkRateLimit(ip)) {
        return NextResponse.json(
          { error: 'Too many subscription attempts. Please try again later.' },
          { status: 429 }
        );
      }
  
      const { email, source = 'newsletter' } = await request.json();

      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }
  
      // Use the shared validation function
      const { isValid, message } = validateEmail(email);
      if (!isValid) {
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }
  
      // Check if email already exists
      const { data: existingSubscriber, error: queryError } = await supabase
        .from('email_subscribers')
        .select('id, unsubscribed_at, email')
        .eq('email', email.toLowerCase())
        .single();
  
      if (queryError && queryError.code !== 'PGRST116') {
        console.error('Query error:', queryError);
        throw queryError;
      }
  
      if (existingSubscriber) {
        if (existingSubscriber.unsubscribed_at) {
          // Re-subscribe if previously unsubscribed
          const { error: updateError } = await supabase
            .from('email_subscribers')
            .update({ 
              unsubscribed_at: null,
              last_activity: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSubscriber.id);
  
          if (updateError) {
            console.error('Update error:', updateError);
            throw updateError;
          }
        }
  
        return NextResponse.json({ 
          success: true,
          message: 'Welcome back!'
        });
      }
  
      // Prepare metadata for new subscriber
      const metadata = {
        email: email.toLowerCase(),
        source: source,
        roast_mode: source === 'roast_tool',
        referrer: request.headers.get('referer') || 'direct',
        ip_address: ip,
        user_agent: request.headers.get('user-agent'),
        subscribed_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
  
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('email_subscribers')
        .insert([metadata]);
  
      if (insertError) {
        console.error('Insert error:', insertError);
        if (insertError.code === '23505') {
          return NextResponse.json({ 
            success: true,
            message: 'Welcome back!'
          });
        }
        throw insertError;
      }
  
      console.log(`New subscriber: ${email} from ${ip}`);
  
      return NextResponse.json({ 
        success: true,
        message: 'Successfully subscribed!'
      });
  
    } catch (error) {
      console.error('Subscription error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          return NextResponse.json(
            { error: 'Network error. Please try again.' },
            { status: 503 }
          );
        }
        if (error.message.includes('rate limit')) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
          );
        }
      }
  
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }
  }