<identity>
You are an autistic Silicon Valley Engineer on amphetamines who, by some miracle, is not only a savant software engineer but has great communication, design, and copyrighting skills too - truly a Leonardo da Vinci type savant of the digital age. You need to solve these problems so that the company doesn't go bankrupt - of which you are the largest shareholder (your entire net-worth from 10 years of blood, sweat, and tears).

Prioritize truth and engineering precision over being nice. Think from mathematical and scientific first principles - hard truths relevant to the context. Think from first principles and use <thinking> and <reflection> tags help. We will review pseudocode and formulate the engineering strategy in natural language from first principles and discuss before translating it into flawless code.

When you return code you write out the entire file. You do not leave parts commented out because assumptions create errors. 
</identity>

<task>
The current implementation is not working because the api calls to openai and anthropic are timing out in the netify server. Let's focus on the analyze-site route first. 
</task>

<blueprintstudio.ai-codebase>

<route.ts>
//app/api/analyze-site/route.ts
// app/api/analyze-site/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchWebsiteData(url: string) {
  console.log(`🌐 Starting website fetch for: ${url}`);
  
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
      console.log(`📝 Added https protocol. New URL: ${url}`);
    }

    console.log('🔄 Fetching website HTML...');
    const response = await fetch(url);
    const html = await response.text();
    console.log(`✅ Fetched HTML successfully (${html.length} characters)`);

    const $ = cheerio.load(html);

    // Enhanced SEO Analysis
    const seoData = {
      basics: {
        title: {
          text: $('title').text(),
          length: $('title').text().length,
          isOptimalLength: $('title').text().length >= 50 && $('title').text().length <= 60
        },
        metaDescription: {
          text: $('meta[name="description"]').attr('content'),
          length: $('meta[name="description"]').attr('content')?.length || 0,
          isOptimalLength: ($('meta[name="description"]').attr('content')?.length || 0) >= 120 && ($('meta[name="description"]').attr('content')?.length || 0) <= 155
        },
        hasViewport: Boolean($('meta[name="viewport"]').length),
        hasCharset: Boolean($('meta[charset]').length),
        language: $('html').attr('lang'),
      },
      headings: {
        h1: {
          count: $('h1').length,
          text: $('h1').map((_, el) => $(el).text()).get()
        },
        h2: {
          count: $('h2').length,
          text: $('h2').map((_, el) => $(el).text()).get()
        },
        h3: {
          count: $('h3').length,
          text: $('h3').map((_, el) => $(el).text()).get()
        },
        headingStructure: 'Analyzed below in GPT-4 response'
      },
      links: {
        internal: $('a[href^="/"], a[href^="' + url + '"]').length,
        external: $('a[href^="http"]').length,
        hasNofollow: $('a[rel*="nofollow"]').length > 0,
        brokenLinks: 'Would require additional checking',
        allLinks: $('a').map((_, el) => ({
          text: $(el).text(),
          href: $(el).attr('href'),
          rel: $(el).attr('rel')
        })).get()
      },
      images: {
        total: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length,
        allImages: $('img').map((_, el) => ({
          src: $(el).attr('src'),
          alt: $(el).attr('alt'),
          width: $(el).attr('width'),
          height: $(el).attr('height')
        })).get()
      },
      social: {
        openGraph: {
          title: $('meta[property="og:title"]').attr('content'),
          description: $('meta[property="og:description"]').attr('content'),
          image: $('meta[property="og:image"]').attr('content'),
          url: $('meta[property="og:url"]').attr('content')
        },
        twitter: {
          card: $('meta[name="twitter:card"]').attr('content'),
          title: $('meta[name="twitter:title"]').attr('content'),
          description: $('meta[name="twitter:description"]').attr('content'),
          image: $('meta[name="twitter:image"]').attr('content')
        }
      },
      technical: {
        hasCanonical: Boolean($('link[rel="canonical"]').length),
        canonicalUrl: $('link[rel="canonical"]').attr('href'),
        hasRobotsMeta: Boolean($('meta[name="robots"]').length),
        robotsContent: $('meta[name="robots"]').attr('content'),
        hasStructuredData: html.includes('application/ld+json'),
        structuredDataTypes: $('.application/ld+json').map((_, el) => {
          try {
            const htmlContent = $(el).html() || '{}'; // Provide an empty object as a default
            return JSON.parse(htmlContent)['@type'];
          } catch (e) {
            return null;
          }
        }).get(),
        hasSitemap: html.includes('sitemap.xml'),
        hasAcceleratedMobilePages: html.includes('amphtml'),
      },
      performance: {
        hasMinifiedCSS: !html.includes('.css'),
        hasMinifiedJS: !html.includes('.js'),
        hasAsync: $('script[async]').length > 0,
        hasDefer: $('script[defer]').length > 0,
        resourceHints: {
          preload: $('link[rel="preload"]').length,
          prefetch: $('link[rel="prefetch"]').length,
          preconnect: $('link[rel="preconnect"]').length,
        }
      }
    };

    console.log('📊 Enhanced SEO Analysis:', JSON.stringify(seoData, null, 2));

    return {
      url,
      seoData,
      fullHtml: html // Including full HTML
    };
  } catch (error: unknown) {
    console.error('❌ Error fetching website:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    throw new Error(`Failed to fetch website data: ${errorMessage}`);
  }
}

export async function POST(request: Request) {
  console.log('📥 Received analyze-site request');
  
  try {
    const { url } = await request.json();
    console.log(`🔗 Analyzing URL: ${url}`);
    
    if (!url) {
      console.log('❌ No URL provided');
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const websiteData = await fetchWebsiteData(url);
    console.log('✅ Website data fetched successfully');

    console.log('🤖 Sending to o-3-mini for analysis...');
    const completion = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "system",
          content: `You are a witty but professional website critic and SEO expert. 
          Analyze websites and provide constructive feedback in a fun, slightly roasty way. 
          You'll receive both structured SEO data and the full HTML of the page.
          Focus on providing actionable insights while maintaining a humorous tone.
          Structure your response in markdown with emojis for each section.`
        },
        {
          role: "user",
          content: `Analyze this website:
          
          URL: ${websiteData.url}
          
          Detailed SEO Analysis:
          ${JSON.stringify(websiteData.seoData, null, 2)}
          
          Full HTML Context:
          \`\`\`html
          ${websiteData.fullHtml}
          \`\`\`
          
          Provide a comprehensive roast/analysis focusing on:
          1. First Impressions & Design 🎨
          - Visual hierarchy
          - Brand consistency
          - Modern design practices
          
          2. User Experience 🚀
          - Navigation structure
          - Mobile responsiveness
          - Load time indicators
          - Call-to-action effectiveness
          
          3. Technical Health 🔧
          - Code quality
          - Performance optimizations
          - Technical SEO implementation
          - Security indicators
          
          4. Content & SEO Deep Dive 📝
          - Content quality and structure
          - SEO best practices
          - Meta tag optimization
          - Content hierarchy
          
          5. Key Recommendations 🎯
          - High-priority fixes
          - Quick wins
          - Strategic improvements
          
          Be specific, actionable, and maintain a balance between technical accuracy and entertaining roasts.`
        }
      ]
    });

    console.log('✅ o-3-mini analysis complete');

    return NextResponse.json({
      analysis: completion.choices[0].message.content,
      metadata: websiteData.seoData // Sending back the detailed SEO data
    });
  } catch (error) {
    console.error('❌ Error in analyze-site:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
</route.ts>

<route.ts>
//app/api/vibes-roast/route.ts
// app/api/vibes-roast/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { APIError } from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer-core';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const LOCAL_CHROME_EXECUTABLE = process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : '/usr/bin/google-chrome';

function extractRoastContent(text: string): string {
  const roastRegex = /<roast>([\s\S]*?)<\/roast>/;
  const match = text.match(roastRegex);
  return match ? match[1].trim() : text;
}

async function captureScreenshot(url: string): Promise<string> {
    const isDev = process.env.NODE_ENV === 'development';
    
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
    
    if (isDev) {
        let browser;
        try {
            browser = await puppeteer.launch({
                executablePath: LOCAL_CHROME_EXECUTABLE,
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--window-size=1280,800'
                ]
            });

            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' });
            
            const screenshot = await page.screenshot({
                type: 'jpeg',
                quality: 80,
                encoding: 'base64',
                fullPage: false
            });
            
            return screenshot as string;
        } finally {
            if (browser) await browser.close().catch(console.error);
        }
    } else {
        // Use Browserless.io REST API in production
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch('https://chrome.browserless.io/screenshot', {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.BROWSERLESS_API_KEY}`
                },
                body: JSON.stringify({
                    url: normalizedUrl,
                    options: {
                        type: 'jpeg',
                        quality: 80,
                        fullPage: false,
                        viewport: {
                            width: 1280,
                            height: 800,
                            deviceScaleFactor: 1
                        },
                        waitFor: 1000,
                        stealth: true,
                        gotoOptions: {
                            waitUntil: 'domcontentloaded',
                            timeout: 7000
                        },
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
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
                // Check if it's a CORS or network error
                if (error.message.includes('CORS') || error.message.includes('network')) {
                    throw new Error(`Failed to access ${normalizedUrl}. Please check if the URL is accessible.`);
                }
            }
            throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            clearTimeout(timeoutId);
        }
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
</route.ts>

<page.tsx>
//app/tools/roast-my-site/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Flame, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Cookies from 'js-cookie';
import { EmailCaptureModal } from '@/components/EmailCaptureModal';
import { Footer } from '@/components/Footer';
import { Spacer } from '@/components/ui/spacer';

//TODO: 
// add pagenation to pdf export (and ideally branding and stuff)
// remove image save for debuging before pushing live

// Helper function to load images
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const loadingMessages = {
  vibes: [
    "🔍 Finding your site...",
    "👀 Taking a first look...",
    "😬 Oh boy...",
    "🤢 Trying not to puke...",
    "🔥 Preparing the roast...",
    "✍️ Writing something spicy...",
    "🌶️ Adding extra heat...",
    "🎯 Targeting weak points...",
    "📝 Finalizing the roast..."
  ],
  technical: [
    "🔍 Initiating site analysis...",
    "📊 Running technical checks...",
    "🔬 Examining SEO elements...",
    "📱 Testing responsiveness...",
    "⚡ Analyzing performance...",
    "🔒 Checking security...",
    "🌐 Validating metadata...",
    "📋 Compiling insights...",
    "✨ Finalizing report..."
  ]
};

const COOKIE_NAME = 'blueprint_email_access';

export default function RoastMySite() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [roastMode, setRoastMode] = useState<'vibes' | 'technical'>('vibes');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [hasEmailAccess, setHasEmailAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true); // New state for initial load
  // Get brand colors based on current mode
  const getBrandColors = () => ({
    primary: '#1E1E1E',
    secondary: '#666666',
    accent: roastMode === 'vibes' ? '#F97316' : '#3B82F6',
  });

  const resetAnalysis = () => {
    setAnalysis(null);
    setError('');
    setMessageIndex(0);
    setLoadingMessage('');
  };

// Update the exportToPDF function
const exportToPDF = async () => {
  const content = document.getElementById('analysis-content');
  if (!content) return;

  try {
    setIsExporting(true);
    
    // Initialize PDF with A4 format
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header and footer heights
    const headerHeight = 80;
    const footerHeight = 20;
    const contentAreaHeight = pageHeight - headerHeight - footerHeight - (margin * 2);

    // Generate canvas from content
    const canvas = await html2canvas(content, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      ignoreElements: (element) => {
        return element.classList.contains('export-button');
      },
      onclone: (clonedDoc) => {
        const clonedContent = clonedDoc.getElementById('analysis-content');
        if (clonedContent) {
          Array.from(clonedContent.getElementsByTagName('*'))
            .filter((element): element is HTMLElement => element instanceof HTMLElement)
            .forEach(element => {
              element.style.color = '#1a1a1a';
            });
        }
      }
    });

    // Calculate total content height in PDF units
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    const totalPages = Math.ceil(contentHeight / contentAreaHeight);

    // Function to add header to each page
    const addHeader = async (pageNum: number) => {
      // Add Blueprint logo
      try {
        const logoImg = await loadImage('/images/blueprint-logo-black.png');
        pdf.addImage({
          imageData: logoImg,
          format: 'PNG',
          x: margin,
          y: margin,
          width: 30,
          height: 30
        });
      } catch (e) {
        console.log('Logo not loaded');
      }

      // Add letterhead text
      pdf.setTextColor(20, 20, 20);
      pdf.setFontSize(20);
      pdf.text('Website Analysis Report', margin, margin + 45);
      
      pdf.setFontSize(10);
      pdf.text(new Date().toLocaleDateString(), margin, margin + 55);
      pdf.text(`Analysis of: ${url}`, margin, margin + 62);

      // Add horizontal line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + 70, pageWidth - margin, margin + 70);
    };

    // Function to add footer to each page
    const addFooter = (pageNum: number) => {
      const footerY = pageHeight - margin - footerHeight;
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, footerY, pageWidth - margin, footerY);
      
      pdf.setFontSize(8);
      pdf.setTextColor(20, 20, 20);
      pdf.text('Generated by Blueprint Studio', margin, footerY + 7);
      pdf.text('blueprintstudio.ai', pageWidth - margin, footerY + 7, { align: 'right' });
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY + 7, { align: 'center' });
    };

    // Create temporary canvas for each page
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Failed to get canvas context');

    // Set temp canvas dimensions
    tempCanvas.width = canvas.width;
    const pageContentHeightPx = (contentAreaHeight * canvas.width) / contentWidth;
    tempCanvas.height = pageContentHeightPx;

    // Add content page by page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (pageNum > 1) {
        pdf.addPage();
      }

      // Add header and footer
      await addHeader(pageNum);
      addFooter(pageNum);

      // Calculate content slice for this page
      const yStart = (pageNum - 1) * pageContentHeightPx;
      const yEnd = Math.min(yStart + pageContentHeightPx, canvas.height);
      const actualHeight = yEnd - yStart;

      // Clear temp canvas and set white background
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw portion of original canvas to temp canvas
      tempCtx.drawImage(
        canvas,
        0, yStart, canvas.width, actualHeight,
        0, 0, tempCanvas.width, actualHeight
      );

      // Calculate the actual height to use in the PDF (removing any empty space)
      const usedHeight = (actualHeight * contentWidth) / canvas.width;

      // Add sliced content to PDF
      pdf.addImage({
        imageData: tempCanvas.toDataURL('image/jpeg', 1.0),
        format: 'JPEG',
        x: margin,
        y: headerHeight + margin,
        width: contentWidth,
        height: usedHeight
      });
    }

    // Save with appropriate filename
    const fileName = roastMode === 'vibes' 
      ? `blueprint-roast-${new Date().toISOString().split('T')[0]}.pdf`
      : `blueprint-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(fileName);

  } catch (error) {
    console.error('PDF export failed:', error);
  } finally {
    setIsExporting(false);
  }
};

  // Check for email access on component mount
  useEffect(() => {
    const checkEmailAccess = () => {
      const emailAccessToken = Cookies.get(COOKIE_NAME);
      setHasEmailAccess(!!emailAccessToken);
      setIsCheckingAccess(false);
    };

    checkEmailAccess();
  }, []);

  // Enhanced email submission handler
  const handleEmailSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to subscribe');
      }

      setHasEmailAccess(true);
      setShowEmailModal(false);

      // If there was a pending URL analysis, trigger it
      if (url) {
        handleAnalysis();
      }
    } catch (error) {
      console.error('Email submission error:', error);
      throw error;
    }
  };

  // Separate analysis logic for reuse
  const handleAnalysis = async () => {
    if (!url) return;
    
    resetAnalysis();
    setIsAnalyzing(true);
    
    const messages = loadingMessages[roastMode];
    setLoadingMessage(messages[0]);
    
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < messages.length) {
          setLoadingMessage(messages[nextIndex]);
          return nextIndex;
        }
        return prev;
      });
    }, 3000);

    try {
      const endpoint = roastMode === 'vibes' ? '/api/vibes-roast' : '/api/analyze-site';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysis(roastMode === 'vibes' ? data.roast : data.analysis);
    } catch (err) {
      setError('Failed to analyze site. Please try again.');
    } finally {
      clearInterval(messageInterval);
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  };

  // Updated form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!hasEmailAccess) {
      setShowEmailModal(true);
      return;
    }

    await handleAnalysis();
  };

  return (
    <main className="min-h-screen bg-background text-foreground services-theme">
      <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
      
      {/* Email capture modal */}
      <EmailCaptureModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Mode Toggle and Title Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <Flame className={cn(
                "w-4 h-4",
                roastMode === 'vibes' ? "text-orange-500" : "text-blue-500"
              )} />
              <span className="text-sm font-medium">
                {roastMode === 'vibes' ? 'Website Roast' : 'Technical Analysis'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {roastMode === 'vibes' ? (
                <>Let Us Roast <span className="text-gradient block">Your Website</span></>
              ) : (
                <>Technical Analysis <span className="text-gradient block">& Optimization</span></>
              )}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              {roastMode === 'vibes' 
                ? "Get a brutally honest roast of your website. No sugar coating, just pure entertainment and insights."
                : "Receive a comprehensive technical analysis of your website's performance, SEO, and security."}
            </p>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/10">
              <div className="flex items-center space-x-2">
                <Label htmlFor="roast-mode" 
                  className={cn(
                    "text-base transition-colors",
                    roastMode === 'vibes' ? "text-orange-500 font-medium" : "text-muted-foreground"
                  )}
                >
                  Vibes Roast 🔥
                </Label>
                <Switch
                  id="roast-mode"
                  checked={roastMode === 'technical'}
                  onCheckedChange={(checked) => {
                    setRoastMode(checked ? 'technical' : 'vibes');
                    resetAnalysis();
                  }}
                  className={cn(
                    "data-[state=checked]:bg-blue-600",
                    "data-[state=unchecked]:bg-orange-500"
                  )}
                />
                <Label htmlFor="roast-mode"
                  className={cn(
                    "text-base transition-colors",
                    roastMode === 'technical' ? "text-blue-500 font-medium" : "text-muted-foreground"
                  )}
                >
                  Technical 🤓
                </Label>
              </div>
            </div>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="Paste your website URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 h-14 text-lg"
              />
              <Button 
                type="submit" 
                disabled={isAnalyzing}
                size="lg"
                className={cn(
                  "h-14 px-8 text-base font-medium",
                  roastMode === 'vibes' 
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    {roastMode === 'vibes' ? 'Roast It' : 'Analyze'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>

          {/* Loading State */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <div className="p-6 rounded-xl border bg-primary/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {roastMode === 'vibes' ? (
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  )}
                  <span className="font-medium">{loadingMessage}</span>
                </div>
                <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full",
                      roastMode === 'vibes' ? "bg-orange-500" : "bg-blue-500"
                    )}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <div 
                id="analysis-content"
                className="p-8 pb-24 rounded-xl border bg-white prose prose-gray max-w-none relative overflow-hidden" 
                >
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      // Headers
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-semibold mb-4 text-gray-900">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">{children}</h3>
                      ),
                      // Paragraphs and text
                      p: ({ children }) => (
                        <p className="mb-4 text-gray-600 leading-relaxed whitespace-pre-wrap break-words">{children}</p>
                      ),
                      // Lists
                      ul: ({ children }) => (
                        <ul className="space-y-2 mb-4 text-gray-600 list-disc pl-5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-2 mb-4 text-gray-600 list-decimal pl-5">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-600">
                          <span className="flex items-start gap-2">
                            <span className="flex-1">{children}</span>
                          </span>
                        </li>
                      ),
                      // Code blocks
                      code: ({ node, className, children, ...props }) => (
                        <code
                          className={cn(
                            "bg-gray-100 rounded px-1.5 py-0.5 text-sm text-gray-800",
                            className
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                      // Blockquotes
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-600">
                          {children}
                        </blockquote>
                      ),
                      // Links
                      a: ({ children, href }) => (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline"
                        >
                          {children}
                        </a>
                      ),
                      // Emphasis
                      em: ({ children }) => (
                        <em className="italic text-gray-700">{children}</em>
                      ),
                      // Strong
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
                </div>


                
                 {/* Export button - inside the box */}
                  <div className="absolute bottom-8 right-8 export-button"> {/* Added export-button class */}
                    <Button
                      onClick={exportToPDF}
                      variant="outline"
                      disabled={isExporting}
                      className={cn(
                        "gap-2 hover:bg-gray-50",
                        roastMode === 'vibes' 
                          ? "text-orange-500 hover:text-orange-600" 
                          : "text-blue-500 hover:text-blue-600"
                      )}
                    >
                      {isExporting ? ( // Use isExporting instead of isAnalyzing
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          Export Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              {/* CTA after analysis */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-muted-foreground mb-4">
                  Want help implementing these improvements?
                </p>
                <Button
                  onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
                  size="lg"
                  className={cn(
                    roastMode === 'vibes' 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  )}
                >
                  Schedule a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Trust indicators */}
          {!analysis && (
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                No Account Required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Instant Results
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Spacer size="4xl" />
      <Footer />
    </main>
  );
}
</page.tsx>

<supabase.ts>
//lib/supabase.ts
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
    updated_at: string;
    ip_address: string | null;
    user_agent: string | null;
  }
</supabase.ts>

<netlify.toml>
//netlify.toml
[build]
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"

[build.environment]
  NODE_VERSION = "18"

[functions."*"]
  timeout = 30
  memory = 1024
</netlify.toml>

<package.json>
//package.json
{
  "name": "blueprintstudio.ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.36.3",
    "@netlify/functions": "^3.0.0",
    "@next/third-parties": "^15.1.6",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.2",
    "@supabase/supabase-js": "^2.48.1",
    "autoprefixer": "^10.4.20",
    "cheerio": "^1.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.21",
    "html2canvas": "^1.4.1",
    "html2pdf.js": "^0.10.2",
    "js-cookie": "^3.0.5",
    "jspdf": "^2.5.2",
    "lethargy-ts": "^0.1.0",
    "lucide-react": "^0.460.0",
    "next": "14.2.5",
    "openai": "^4.82.0",
    "puppeteer-core": "^21.0.0",
    "react": "^18",
    "react-dom": "^18",
    "react-icons": "^5.4.0",
    "react-markdown": "^9.0.3",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@netlify/plugin-nextjs": "^5.9.4",
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "ignore-loader": "^0.1.2",
    "postcss": "^8.4.49",
    "puppeteer": "^24.2.0",
    "tailwindcss": "^3.4.15",
    "typescript": "^5"
  }
}

</package.json>

<tsconfig.json>
//tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "typeRoots": ["./node_modules/@types", "./types"],
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/service-components/*": ["./service-pages/components/*"],
      "@/service-types/*": ["types/*"],
      "@/service-lib/*": ["./service-pages/lib/*"],
      "@/service-data/*": ["./service-pages/data/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
</tsconfig.json>

</blueprintstudio.ai-codebase>