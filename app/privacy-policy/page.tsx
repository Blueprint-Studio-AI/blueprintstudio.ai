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

              
              <hr className="my-8" />

              <br/>
              <h1>SelfSci App Privacy Policy</h1>
              <p>SelfSci is a decentralized science &#40;DeSci&#41; platform that empowers individuals to conduct rigorous self-experimentation using their own health data. Our application integrates diverse biometric data sources—including fitness tracker wearable devices &#40;potentially from Garmin&#41;, Motiv EPIC X EEG sensors, and comprehensive dietary tracking—to provide users with unprecedented insights into their personal health patterns. SelfSci enables users to perform controlled experiments on themselves, analyze correlations in their biometric data, and optimize their health through data-driven self-discovery.&nbsp;&nbsp;</p>

              <h2>Garmin Health Data Collection and Usage</h2>
              <p>This section specifically addresses our collection, use, and handling of health and fitness data obtained through Garmin&apos;s platform and API services.&nbsp;</p>

              <h3>Data We Collect from Garmin</h3>
              <p>With your explicit consent, we collect the following health and biometric data from your Garmin account:&nbsp;</p>
              <ul>
                <li>Heart rate variability &#40;HRV&#41; measurements&nbsp;</li>
                <li>Sleep quality metrics and sleep stages&nbsp;</li>
                <li>Activity and exercise data &#40;steps, calories, workout sessions&#41;&nbsp;</li>
                <li>Stress level measurements&nbsp;</li>
                <li>Body battery energy monitoring data&nbsp;</li>
                <li>Recovery and training readiness metrics&nbsp;</li>
                <li>Environmental and contextual data &#40;time, date, location if enabled&#41;&nbsp;</li>
              </ul>

              <h3>Purpose and Use of Garmin Data</h3>
              <p>We use your Garmin health data exclusively for the following research and application purposes:&nbsp;</p>
              <ul>
                <li><strong>Personal Self-Experimentation:</strong> Your data enables you to conduct controlled experiments on yourself to understand how different variables affect your health and performance&nbsp;</li>
                <li><strong>Multi-Modal Health Analysis:</strong> Combining Garmin data with other biometric signals &#40;EEG from Motiv EPIC X devices, dietary tracking&#41; to provide comprehensive personal health insights&nbsp;</li>
                <li><strong>Personalized Health Recommendations:</strong> Generating data-driven suggestions for sleep, recovery, and performance optimization based on your individual patterns&nbsp;</li>
                <li><strong>Longitudinal Health Tracking:</strong> Monitoring trends and correlations in your health metrics over time to identify patterns and potential personal health optimization opportunities&nbsp;</li>
              </ul>

              <h3>Data Processing and Analysis</h3>
              <p>Your Garmin health data is processed using advanced analytics and machine learning algorithms to:&nbsp;</p>
              <ul>
                <li>Identify correlations between different health metrics&nbsp;</li>
                <li>Generate predictive insights about your health and performance&nbsp;</li>
                <li>Provide personalized recommendations based on your unique biometric profile&nbsp;</li>
                <li>Support your participation in self-directed health research&nbsp;</li>
              </ul>

              <h3>Data Sharing and Third-Party Access</h3>
              <p>Your Garmin health data:&nbsp;</p>
              <ul>
                <li>Will never be sold to third parties&nbsp;</li>
                <li>May be aggregated and anonymized for research purposes&nbsp;</li>
                <li>Will only be shared with your explicit consent for specific research collaborations&nbsp;</li>
                <li>Remains under your control with options to export or delete upon request&nbsp;</li>
              </ul>

              <h3>Data Retention and Deletion</h3>
              <p>Garmin health data collected through our platform:&nbsp;</p>
              <ul>
                <li>Is retained for as long as you maintain an active account&nbsp;</li>
                <li>Can be deleted upon your written request within 30 days&nbsp;</li>
                <li>May be retained in anonymized, aggregated form for research purposes&nbsp;</li>
                <li>Is automatically purged from active systems 90 days after account deletion&nbsp;</li>
              </ul>

              <h3>Security of Garmin Data</h3>
              <p>We implement enhanced security measures specifically for health data:&nbsp;</p>
              <ul>
                <li>End-to-end encryption during data transmission and storage&nbsp;</li>
                <li>Restricted access controls with audit logging&nbsp;</li>
                <li>SOC 2 Type 2 compliance with annual audits for security, availability, processing integrity, confidentiality, and privacy &nbsp;</li>
                <li>AES-256 encryption at rest and TLS encryption in transit &nbsp;</li>
                <li>Regular penetration testing by industry experts &nbsp;</li>
                <li>Row-Level Security &#40;RLS&#41; with PostgreSQL-native access controls for granular data protection &nbsp;</li>
                <li>Cloudflare CDN protection and fail2ban implementation for DDoS mitigation &nbsp;</li>
                <li>Weekly security advisories with automated monitoring and one-click issue resolution &nbsp;</li>
              </ul>

              <h3>Your Rights Regarding Garmin Data</h3>
              <p>You have the right to:&nbsp;</p>
              <ul>
                <li>Revoke consent for Garmin data collection at any time&nbsp;</li>
                <li>Request deletion of your Garmin data&nbsp;</li>
                <li>Receive detailed reports on how your Garmin data is being used&nbsp;</li>
                <li>Opt out of specific research initiatives while maintaining other services&nbsp;</li>
              </ul>


              <br/>
              <hr className="my-8" />
              <br/>
              <br/>

              <h1>Blueprint Studio Privacy Policy</h1>

              <h2>Our Commitment to Your Privacy</h2>
              <p>At Blueprint Design Studio, we believe that great design extends to how we handle your personal information. This privacy policy explains how we collect, use, and protect your data when you use our website and services. We are committed to maintaining the highest standards of privacy protection and transparency in all our practices.&nbsp;</p>

              <h2>Information We Collect</h2>
              <h3>Information You Provide</h3>
              <ul>
                <li>Contact information when you reach out to us &#40;name, email, phone number&#41;&nbsp;</li>
                <li>Project details and requirements when you inquire about our services&nbsp;</li>
                <li>Feedback and communications you send to us&nbsp;</li>
                <li>Information provided during our design consultation process&nbsp;</li>
              </ul>

              <h3>Information Collected Automatically</h3>
              <ul>
                <li>Website usage data and analytics to improve our user experience&nbsp;</li>
                <li>Device and browser information for optimal site performance&nbsp;</li>
                <li>IP address and general location data for security purposes&nbsp;</li>
                <li>Cookies and similar technologies to enhance functionality&nbsp;</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:&nbsp;</p>
              <ul>
                <li>Provide exceptional design services tailored to your needs&nbsp;</li>
                <li>Communicate with you about projects, updates, and inquiries&nbsp;</li>
                <li>Improve our website functionality and user experience&nbsp;</li>
                <li>Send relevant updates about our services &#40;with your consent&#41;&nbsp;</li>
                <li>Protect against fraudulent or unauthorized activity&nbsp;</li>
                <li>Comply with legal obligations and industry standards&nbsp;</li>
              </ul>

              <h2>Information Sharing and Disclosure</h2>
              <p>We respect your privacy and do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:&nbsp;</p>
              <ul>
                <li><strong>With your consent:</strong> When you explicitly authorize us to share information&nbsp;</li>
                <li><strong>Service providers:</strong> With trusted partners who help us operate our business &#40;hosting, analytics, communication tools&#41;&nbsp;</li>
                <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety&nbsp;</li>
                <li><strong>Business transfers:</strong> In the event of a merger or acquisition &#40;with continued privacy protection&#41;&nbsp;</li>
              </ul>

              <h2>Data Security</h2>
              <p>We implement comprehensive security measures to protect your personal information:&nbsp;</p>
              <ul>
                <li>Industry-standard encryption for data transmission and storage&nbsp;</li>
                <li>Regular security assessments and updates&nbsp;</li>
                <li>Access controls and authentication protocols&nbsp;</li>
                <li>Secure hosting infrastructure with reputable providers&nbsp;</li>
                <li>Employee training on data protection best practices&nbsp;</li>
              </ul>

              <h2>Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to enhance your browsing experience and gather insights about website performance. These help us:&nbsp;</p>
              <ul>
                <li>Remember your preferences and settings&nbsp;</li>
                <li>Analyze website traffic and user behavior&nbsp;</li>
                <li>Improve our content and functionality&nbsp;</li>
                <li>Provide relevant information about our services&nbsp;</li>
              </ul>
              <p>You can control cookie settings through your browser preferences, though some functionality may be limited if cookies are disabled.&nbsp;</p>

              <h2>Your Rights and Choices</h2>
              <p>You have several rights regarding your personal information:&nbsp;</p>
              <ul>
                <li><strong>Access:</strong> Request information about what personal data we hold about you&nbsp;</li>
                <li><strong>Correction:</strong> Ask us to update or correct inaccurate information&nbsp;</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data &#40;subject to legal obligations&#41;&nbsp;</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time&nbsp;</li>
                <li><strong>Objection:</strong> Object to certain types of data processing&nbsp;</li>
              </ul>

              <h2>Data Retention</h2>
              <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. Project-related information is typically retained for the duration of our business relationship and for a reasonable period thereafter for portfolio and reference purposes.&nbsp;</p>

              <h2>Third-Party Services</h2>
              <p>Our website may contain links to third-party services or integrate with external platforms. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies before providing any personal information.&nbsp;</p>

              <h2>International Data Transfers</h2>
              <p>If you are located outside the United States, please note that we may transfer and process your information in the US or other countries. We ensure appropriate safeguards are in place to protect your information in accordance with applicable privacy laws.&nbsp;</p>

              <h2>Children&apos;s Privacy</h2>
              <p>Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.&nbsp;</p>

              <h2>Changes to This Policy</h2>
              <p>We may update this privacy policy periodically to reflect changes in our practices or applicable laws. We will notify you of significant changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.&nbsp;</p>

              <h2>Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please reach out to your account manager, or use our contact us form.&nbsp;</p>

              <p>We are committed to addressing your privacy concerns promptly and transparently.&nbsp;</p>
              
              <p className="mt-8 text-sm text-gray-500">Blueprint Design Studio is dedicated to protecting your privacy while delivering exceptional design experiences. This policy reflects our commitment to transparency, security, and respect for your personal information.&nbsp;</p>


              {/* //////////////////// */}


              {/* <h1>Blueprint Design Studio</h1>

              <h2>1. The Reality of Internet Privacy</h2>
              <p>Let&apos;s be direct: true privacy on the internet doesn&apos;t exist. This document explains how we handle your data while acknowledging this fundamental truth. By using our services, you&apos;re participating in the modern digital ecosystem with all its inherent data collection realities.&nbsp;</p>

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
                <li>Lives on servers we don&apos;t physically control&nbsp;</li>
                <li>Passes through numerous third-party services&nbsp;</li>
                <li>Is backed up across multiple locations&nbsp;</li>
                <li>May be processed by AI/ML systems&nbsp;</li>
                <li>Could be subject to legal requests or breaches&nbsp;</li>
              </ul>

              <h2>4. Security Measures (Best Effort)</h2>
              <p>We implement industry-standard security practices while acknowledging that perfect security doesn&apos;t exist. We use:&nbsp;</p>
              <ul>
                <li>HTTPS encryption&nbsp;</li>
                <li>Secure cloud infrastructure&nbsp;</li>
                <li>Access controls and monitoring&nbsp;</li>
                <li>Regular security updates&nbsp;</li>
              </ul>

              <h2>5. Cookie Reality</h2>
              <p>We use cookies because modern web applications require them. You can block them, but our site probably won&apos;t work properly. They track your behavior to make the site work and help us improve it.&nbsp;</p>

              <h2>6. Your Data Rights</h2>
              <p>Under various laws (GDPR, CCPA), you have theoretical rights to your data. In practice:&nbsp;</p>
              <ul>
                <li>We&apos;ll try to delete your data if you ask&nbsp;</li>
                <li>Some data can&apos;t be fully deleted due to technical limitations&nbsp;</li>
                <li>Backups may retain your information&nbsp;</li>
                <li>Third-party services may have their own retention policies&nbsp;</li>
              </ul>

              <h2>7. Third-Party Services</h2>
              <p>We use numerous third-party services. Each has its own privacy policy and data practices. We don&apos;t control them. Major ones include:&nbsp;</p>
              <ul>
                <li>Google Analytics&nbsp;</li>
                <li>Cloud hosting providers&nbsp;</li>
                <li>Payment processors&nbsp;</li>
                <li>Marketing tools&nbsp;</li>
              </ul>

              <h2>8. Policy Updates</h2>
              <p>This policy will change as technology evolves. We&apos;ll update it as needed without guaranteeing notifications.&nbsp;</p>

              <h2>9. Legal Compliance Statement</h2>
              <p>We comply with applicable laws while maintaining operational efficiency. In case of conflicts, we prioritize system functionality and user experience within legal boundaries.&nbsp;</p>

              <h2>10. Contact</h2>
              <p>For privacy or legal concerns, please email us.</p>
              
              <p className="mt-8 text-sm text-gray-500">Note: This policy aims for transparency rather than traditional corporate privacy policy language. We believe you deserve to know the technical reality of internet data handling.&nbsp;</p> */}
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
};

export default PrivacyPolicy;