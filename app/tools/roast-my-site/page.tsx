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

//TODO: 
// Fix type error on analyze site route
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
    
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Letterhead dimensions (A4: 210 x 297 mm)
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Add Blueprint logo
    try {
      const logoImg = await loadImage('/images/blueprint-logo-black.png');
      pdf.addImage(logoImg, 'PNG', margin, margin, 30, 30); // Slightly smaller logo
    } catch (e) {
      console.log('Logo not loaded');
    }

    // Add letterhead text - now left aligned
    pdf.setTextColor(20, 20, 20); // Very dark gray, almost black
    pdf.setFontSize(20);
    pdf.text('Website Analysis Report', margin, margin + 45);
    
    // Add date and URL - also left aligned
    pdf.setFontSize(10);
    pdf.text(new Date().toLocaleDateString(), margin, margin + 55);
    pdf.text(`Analysis of: ${url}`, margin, margin + 62);

    // Add horizontal line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 70, pageWidth - margin, margin + 70);

    // Modify the html2canvas options to ensure black text
    const canvas = await html2canvas(content, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      ignoreElements: (element) => {
        return element.classList.contains('export-button');
      },
      onclone: (clonedDoc) => {
        // Force black text in the PDF
        const clonedContent = clonedDoc.getElementById('analysis-content');
        if (clonedContent) {
          const elements = Array.from(clonedContent.getElementsByTagName('*'))
            .filter((element): element is HTMLElement => element instanceof HTMLElement);
          elements.forEach(element => {
            element.style.color = '#1a1a1a'; // Very dark gray for text
          });
        }
      }
    });

    // Calculate content dimensions
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Add content
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      margin,
      margin + 80, // Adjusted to start after header
      contentWidth,
      contentHeight
    );

    // Add footer
    const footerY = 277;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY, pageWidth - margin, footerY);
    
    // Footer text - left/right aligned
    pdf.setFontSize(8);
    pdf.setTextColor(20, 20, 20); // Very dark gray
    pdf.text('Generated by Blueprint Studio', margin, footerY + 7);
    pdf.text('blueprintstudio.ai', pageWidth - margin, footerY + 7, { align: 'right' });
    
    // Page number centered
    pdf.text(`Page 1`, pageWidth / 2, footerY + 7, { align: 'center' });

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
                className="p-8 pb-24 rounded-xl border bg-white prose prose-gray max-w-none relative"
              >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-semibold mb-4 text-gray-800">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-4 text-gray-600">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-gray-600">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-2",
                        roastMode === 'vibes' ? "bg-orange-500" : "bg-blue-500"
                      )} />
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {analysis}
              </ReactMarkdown>
                
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
                No Sign-up Required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Instant Results
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}