// app/terms/page.tsx
"use client";

import React from 'react';
import { Footer } from '@/components/Footer';

const Terms: React.FC = () => {
    const currentDate = new Date().toLocaleDateString();
    
    return (
      <main className="min-h-screen bg-background text-foreground services-theme relative">
        <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
        
        <div className="relative">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
            <div className="markdown-content">
              <p>Last updated: {currentDate}&nbsp;</p>

              <h2>1. Agreement to Terms</h2>
              <p>By accessing or using Blueprint Studio&apos;s services, you agree to be bound by these terms. If you disagree with any part of the terms, you do not have permission to access our services.&nbsp;</p>

              <h2>2. Service Description</h2>
              <p>Blueprint Studio provides comprehensive digital services including:&nbsp;</p>
              <ul>
                <li>Web Design & Development Services&nbsp;</li>
                <li>Digital Marketing & Growth Services&nbsp;</li>
                <li>AI & Automation Solutions&nbsp;</li>
                <li>Business Strategy & Consulting&nbsp;</li>
                <li>Software Development & Technical Services&nbsp;</li>
              </ul>

              <h2>3. Intellectual Property</h2>
              <p>Regarding our work and deliverables:&nbsp;</p>
              <ul>
                <li>You retain rights to your content and custom implementations&nbsp;</li>
                <li>We retain rights to our proprietary tools, frameworks, and systems&nbsp;</li>
                <li>For AI-generated content, outputs are provided &ldquo;as-is&rdquo; without guarantee of originality&nbsp;</li>
                <li>You are responsible for validating and testing all deliverables&nbsp;</li>
                <li>We maintain rights to generic solutions that may benefit other clients&nbsp;</li>
              </ul>

              <h2>4. Usage Terms</h2>
              <p>You agree not to:&nbsp;</p>
              <ul>
                <li>Reverse engineer our systems or algorithms&nbsp;</li>
                <li>Exceed API rate limits or abuse system resources&nbsp;</li>
                <li>Use our services for illegal or harmful purposes&nbsp;</li>
                <li>Share or resell access without authorization&nbsp;</li>
                <li>Attempt to circumvent security measures&nbsp;</li>
              </ul>

              <h2>5. Payment Terms</h2>
              <p>For paid services:&nbsp;</p>
              <ul>
                <li>Payments are non-refundable unless legally required&nbsp;</li>
                <li>We may modify pricing with 30 days notice&nbsp;</li>
                <li>Usage-based fees are calculated based on our monitoring systems&nbsp;</li>
                <li>Disputed charges must be reported within 60 days&nbsp;</li>
              </ul>

              <h2>6. Service Limitations</h2>
              <p>We explicitly state that:&nbsp;</p>
              <ul>
                <li>Services may be unavailable or modified without notice&nbsp;</li>
                <li>AI outputs require human validation and testing&nbsp;</li>
                <li>We don&apos;t guarantee specific performance metrics&nbsp;</li>
                <li>Service quality may vary based on factors outside our control&nbsp;</li>
              </ul>

              <h2>7. Liability Limitations</h2>
              <p>To the maximum extent permitted by law:&nbsp;</p>
              <ul>
                <li>We provide services &rdquo;as is&ldquo; without warranties&nbsp;</li>
                <li>We&apos;re not liable for any damages from service use&nbsp;</li>
                <li>Our total liability is limited to fees paid in the last 12 months&nbsp;</li>
                <li>You agree to indemnify us against third-party claims&nbsp;</li>
              </ul>

              <h2>8. Data Usage</h2>
              <p>Regarding your data:&nbsp;</p>
              <ul>
                <li>We may use it to improve our services&nbsp;</li>
                <li>We follow our Privacy Policy for data handling&nbsp;</li>
                <li>You maintain responsibility for data accuracy&nbsp;</li>
                <li>We may delete inactive account data&nbsp;</li>
              </ul>

              <h2>9. Termination</h2>
              <p>We may terminate or suspend access to our services:&nbsp;</p>
              <ul>
                <li>For terms violations&nbsp;</li>
                <li>For extended inactivity&nbsp;</li>
                <li>If we cease operations&nbsp;</li>
                <li>Without cause with reasonable notice&nbsp;</li>
              </ul>

              <h2>10. Changes to Terms</h2>
              <p>We may modify these terms at any time. Continued use of our services constitutes acceptance of new terms.&nbsp;</p>

              <h2>11. Governing Law</h2>
              <p>These terms are governed by United States law. Any disputes shall be resolved in the appropriate United States courts. You agree to submit to the personal jurisdiction of the United States courts for the purpose of litigating all such claims.&nbsp;</p>

              <h2>12. Contact</h2>
              <p>For legal inquiries, please contact us at <a href="mailto:blueprint.dao@gmail.com" className="text-blue-500 hover:text-blue-600">blueprint.dao@gmail.com</a>.</p>

              <p className="mt-8 text-sm text-gray-500">Note: These terms are designed to be clear and direct. They protect both parties while acknowledging the realities of modern digital services.&nbsp;</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
};

export default Terms;