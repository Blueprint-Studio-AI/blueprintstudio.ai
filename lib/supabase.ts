// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Type for email subscribers
export interface EmailSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  source: string;
  roast_mode: boolean;
  referrer: string | null;
  last_activity: string;
  unsubscribed_at: string | null;
  created_at: string;
}