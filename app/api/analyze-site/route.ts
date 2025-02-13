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