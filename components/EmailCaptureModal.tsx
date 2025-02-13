// components/EmailCaptureModal.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Cookies from 'js-cookie';
import { validateEmail } from '@/lib/validation'; // Import the validation function

const COOKIE_NAME = 'blueprint_email_access';
const COOKIE_EXPIRY = 30; // days

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function EmailCaptureModal({ isOpen, onClose, onSubmit }: EmailCaptureModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setShowSuccess(false);
      
      // Use the shared validation function
      const { isValid, message } = validateEmail(email);
      if (!isValid) {
        setError(message || 'Invalid email address');
        return;
      }
  
      setIsSubmitting(true);
      try {
        await onSubmit(email);
        
        // Set secure cookie with email hash
        const emailHash = btoa(email).slice(0, 10);
        Cookies.set(COOKIE_NAME, emailHash, {
          expires: COOKIE_EXPIRY,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setError('Failed to submit email. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-8 bg-white rounded-xl shadow-xl"
          >
            {!showSuccess ? (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
                    <Flame className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Unlock Website Roasts</h2>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    Get brutally honest website feedback and technical insights delivered straight to your inbox.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full h-12 text-lg"
                    />
                    {error && (
                      <p className="text-red-500 text-sm px-1">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Start Roasting'
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 px-4">
                    By continuing, you agree to receive occasional updates about our tools and services. 
                    You can unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6"
                >
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
                <p className="text-gray-600">Redirecting you to the roasting tool...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}