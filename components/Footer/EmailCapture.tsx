"use client";
import { useState, useEffect } from 'react';
import { validateEmail } from '@/lib/validation';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'blueprint_email_access';

export default function EmailCapture() {
    return (
        <div className="bg-neutral-600 h-[119px] w-[400px]">
            <h1 >Email capture here</h1>
        </div>
    )
}

// const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showSubscribe, setShowSubscribe] = useState(true);
//   const [isSuccess, setIsSuccess] = useState(false);

//   Check for existing subscription on mount
//   useEffect(() => {
//     const emailAccessToken = Cookies.get(COOKIE_NAME);
//     if (emailAccessToken) {
//       setShowSubscribe(false);
//     }
//   }, []);

//   const handleSubscribe = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Validate email
//     const { isValid, message } = validateEmail(email);
//     if (!isValid) {
//       setError(message || 'Invalid email');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/subscribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Subscription failed');
//       }

//       // Show success state
//       setIsSuccess(true);

//       // Animate out after delay
//       setTimeout(() => {
//         setShowSubscribe(false);
//       }, 2000);

//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to subscribe');
//     } finally {
//       setIsLoading(false);
//     }
//   };