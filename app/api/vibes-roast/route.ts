// app/api/vibes-roast/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { APIError } from '@anthropic-ai/sdk';
import chromium from '@sparticuz/chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const LOCAL_CHROME_EXECUTABLE = process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : '/usr/bin/google-chrome';

async function captureScreenshot(url: string): Promise<string> {
    const isDev = process.env.NODE_ENV === 'development';
    
    let browser;
    try {
        if (isDev) {
            browser = await puppeteer.launch({
                executablePath: LOCAL_CHROME_EXECUTABLE,
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1280,800'
                ]
            });
        } else {
            // Configure chrome-aws-lambda for serverless environment
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: {
                    width: 1280,
                    height: 800,
                    deviceScaleFactor: 1,
                },
                executablePath: await chromium.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            });
        }

        const page = await browser.newPage();
        
        await page.setViewport({ width: 1280, height: 800 });
        await page.setDefaultNavigationTimeout(30000);
        await page.setDefaultTimeout(30000);
        
        await page.setExtraHTTPHeaders({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        });
        
        await page.goto(url, {
            waitUntil: ['networkidle0', 'domcontentloaded', 'load'],
            timeout: 30000,
        });

        // Wait for common content indicators
        await Promise.all([
            page.waitForSelector('img', { timeout: 5000 }).catch(() => {}),
            page.waitForFunction(() => {
                const elements = Array.from(document.getElementsByTagName('*'));
                return elements.some(element => {
                    const style = window.getComputedStyle(element);
                    return style.backgroundImage !== 'none';
                });
            }, { timeout: 5000 }).catch(() => {}),
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 100);
            });
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: 100,
            encoding: 'base64',
            fullPage: false,
            captureBeyondViewport: false,
        });
        
        return screenshot as string;
    } catch (error) {
        console.error('Screenshot capture error:', error);
        throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

function extractRoastContent(text: string): string {
  const roastRegex = /<roast>([\s\S]*?)<\/roast>/;
  const match = text.match(roastRegex);
  return match ? match[1].trim() : text;
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

    const screenshot = await captureScreenshot(url);
    // const debugFilename = await saveDebugScreenshot(screenshot, url);

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
      // debugScreenshot: debugFilename
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