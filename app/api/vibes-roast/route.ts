// app/api/vibes-roast/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { APIError } from '@anthropic-ai/sdk';

export const runtime = 'edge'; 

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function extractRoastContent(text: string): string {
  const roastRegex = /<roast>([\s\S]*?)<\/roast>/;
  const match = text.match(roastRegex);
  return match ? match[1].trim() : text;
}

async function captureScreenshot(url: string): Promise<string> {
    // Normalize and validate URL
    let normalizedUrl = url;
    try {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            normalizedUrl = `https://${url}`;
        }
        new URL(normalizedUrl); // Validate URL format
    } catch (error) {
        throw new Error('Invalid URL provided');
    }

    // Use Browserless.io REST API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(`https://chrome.browserless.io/screenshot?token=${process.env.BROWSERLESS_API_KEY}`, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: normalizedUrl,
                options: {
                    type: 'jpeg',
                    quality: 80,
                    fullPage: false
                }
            }),
            signal: controller.signal
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No error details available');
            console.error('Browserless API Error:', {
                status: response.status,
                statusText: response.statusText,
                errorText
            });
            throw new Error(`Screenshot API returned ${response.status}: ${errorText}`);
        }

        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) {
            throw new Error('Empty screenshot received');
        }
        
        return Buffer.from(buffer).toString('base64');
    } catch (error) {
        console.error('Screenshot API error:', error);
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Screenshot capture timed out');
            }
            if (error.message.includes('CORS') || error.message.includes('network')) {
                throw new Error(`Failed to access ${normalizedUrl}. Please check if the URL is accessible.`);
            }
        }
        throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Set a timeout for the entire operation
        const screenshotPromise = captureScreenshot(url);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Operation timed out')), 8000)
        );

        const screenshot = await Promise.race([
            screenshotPromise,
            timeoutPromise
        ]) as string;

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4096,
            temperature: 1,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "You are an inquisitive ai comic tasked with roasting websites based on their appearance. Your goal is to create a humorous and\nedgy critique of the website shown in the provided image. To help you understand the desired tone and style of humor, you will be provided with a set of classic jokes for reference.\n\nFirst, examine the provided image(s) of the website.\n\nSpend time thoroughly ingesting them. Think about the elements, colors, and layout using <thinking> tags to help.\n\nNow, to get you in the right mindset, here are some classic jokes to inspire your humor:\n\n<jokes>\n\"You look like a cartoon of a tumor.\"\n\"You have the kind of face that makes onions cry.\"\n\"You're like a fart in a hurricane—loud, proud, and completely useless.\"\n\"Jonah, you look like the mascot for diabetes.\"\n</jokes>\n\nUsing the image and the jokes as inspiration, follow these steps to create a roast for the website:\n\n1. Analyze the website's design elements, including layout, color scheme, typography, and overall aesthetic.\n\n2. Identify any outdated, unusual, or poorly executed features.\n\n3. Think of clever comparisons, puns, or exaggerations related to the website's appearance.\n\n4. Craft 3-5 creative  remarks about the website, drawing inspiration from the jokes provided.\n\n5. Ensure your roast is funny and extra points for a drop-dead funny savage visual style of comedy.\n\n6. Include at least one reference or comparison to a well-known cultural phenomenon, historical event, or pop culture element.\n\nPresent your roast in the following format:\n\n<roast>\n[Opening line setting up the roast]\n\n[3-5 witty remarks about the website]\n\n[Closing line summarizing the roast]\n</roast>\n\nRemember to make your roast truly creative, funny, and memorable. Your goal is to entertain and amuse with brutally honest critique.\n"
                        },
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: "image/jpeg",
                                data: screenshot
                            }
                        }
                    ]
                }
            ]
        });

        const fullContent = response.content.reduce((acc, content) => {
            if ('type' in content && content.type === 'text') {
                return acc + content.text;
            }
            return acc;
        }, '');

        const roastContent = extractRoastContent(fullContent);

        return NextResponse.json({
            roast: roastContent || 'Failed to generate roast',
        });

    } catch (error) {
        console.error('Error in vibes-roast:', error);
        
        if (error instanceof Anthropic.APIError) {
            const apiError = error as APIError;
            return NextResponse.json(
                { 
                    error: 'API Error',
                    details: apiError.error ? String(apiError.error) : 'Unknown API error',
                    status: apiError.status
                },
                { status: apiError.status }
            );
        }

        return NextResponse.json(
            { 
                error: 'Failed to generate roast', 
                details: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}