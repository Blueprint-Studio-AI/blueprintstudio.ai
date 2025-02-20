"use client";

import React from 'react';  
import { Footer } from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
    const currentDate = new Date().toLocaleDateString();
    
    return (
      <main className="min-h-screen bg-background text-foreground services-theme relative">
        <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
        
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy & Data Reality Statement</h1>
            <div className="markdown-content">
              <p>Last updated: {currentDate}&nbsp;</p>

              <h2>1. The Reality of Internet Privacy</h2>
              <p>Let&aposs be direct: true privacy on the internet doesn&apost exist. This document explains how we handle your data while acknowledging this fundamental truth. By using our services, you&aposre participating in the modern digital ecosystem with all its inherent data collection realities.&nbsp;</p>

              <h2>2. What We Actually Track</h2>
              <p>Our systems automatically collect:&nbsp;</p>
              <ul>
                <li>Everything you type, click, or interact with on our site&nbsp;</li>
                <li>Your IP address, browser fingerprint, and device information&nbsp;</li>
                <li>Session data and behavior patterns&nbsp;</li>
                <li>All communication content and metadata&nbsp;</li>
                <li>Third-party analytics data (Google, etc.)&nbsp;</li>
              </ul>

              <h2>3. How Your Data Actually Moves</h2>
              <p>Your data:&nbsp;</p>
              <ul>
                <li>Lives on servers we don&apost physically control&nbsp;</li>
                <li>Passes through numerous third-party services&nbsp;</li>
                <li>Is backed up across multiple locations&nbsp;</li>
                <li>May be processed by AI/ML systems&nbsp;</li>
                <li>Could be subject to legal requests or breaches&nbsp;</li>
              </ul>

              <h2>4. Security Measures (Best Effort)</h2>
              <p>We implement industry-standard security practices while acknowledging that perfect security doesn&apost exist. We use:&nbsp;</p>
              <ul>
                <li>HTTPS encryption&nbsp;</li>
                <li>Secure cloud infrastructure&nbsp;</li>
                <li>Access controls and monitoring&nbsp;</li>
                <li>Regular security updates&nbsp;</li>
              </ul>

              <h2>5. Cookie Reality</h2>
              <p>We use cookies because modern web applications require them. You can block them, but our site probably won&apost work properly. They track your behavior to make the site work and help us improve it.&nbsp;</p>

              <h2>6. Your Data Rights</h2>
              <p>Under various laws (GDPR, CCPA), you have theoretical rights to your data. In practice:&nbsp;</p>
              <ul>
                <li>We&aposll try to delete your data if you ask&nbsp;</li>
                <li>Some data can&apost be fully deleted due to technical limitations&nbsp;</li>
                <li>Backups may retain your information&nbsp;</li>
                <li>Third-party services may have their own retention policies&nbsp;</li>
              </ul>

              <h2>7. Third-Party Services</h2>
              <p>We use numerous third-party services. Each has its own privacy policy and data practices. We don&apost control them. Major ones include:&nbsp;</p>
              <ul>
                <li>Google Analytics&nbsp;</li>
                <li>Cloud hosting providers&nbsp;</li>
                <li>Payment processors&nbsp;</li>
                <li>Marketing tools&nbsp;</li>
              </ul>

              <h2>8. Policy Updates</h2>
              <p>This policy will change as technology evolves. We&aposll update it as needed without guaranteeing notifications.&nbsp;</p>

              <h2>9. Legal Compliance Statement</h2>
              <p>We comply with applicable laws while maintaining operational efficiency. In case of conflicts, we prioritize system functionality and user experience within legal boundaries.&nbsp;</p>

              <h2>10. Contact</h2>
              <p>For privacy or legal concerns, please use our <a href="/contact" className="text-blue-500 hover:text-blue-600">secure contact form</a>.&nbsp;</p>
              
              <p className="mt-8 text-sm text-gray-500">Note: This policy aims for transparency rather than traditional corporate privacy policy language. We believe you deserve to know the technical reality of internet data handling.&nbsp;</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
};

export default PrivacyPolicy;