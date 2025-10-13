"use client";
import { useState, useEffect } from 'react';
import { validateEmail } from '@/lib/validation';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'blueprint_email_access';

export default function EmailCapture() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSubscribe, setShowSubscribe] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleTryAgain = () => {
        setError('')
    }

    // Check for existing subscription on mount
    useEffect(() => {
        const emailAccessToken = Cookies.get(COOKIE_NAME);
        if (emailAccessToken) {
            setShowSubscribe(false);
        }
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        const { isValid, message } = validateEmail(email);
        if (!isValid) {
            setError(message || 'Invalid email');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, source: 'footer_newsletter' }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Subscription failed');
            }

            // Show success state
            setIsSuccess(true);

            // Start fade out after delay
            setTimeout(() => {
                setIsFading(true);
            }, 1500);

            // Hide completely after fade
            setTimeout(() => {
                setShowSubscribe(false);
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to subscribe');
        } finally {
            setIsLoading(false);
        }
    };

    if (!showSubscribe) return (
        <div className="p-4 flex flex-col gap-3 w-full max-w-[400px] h-36" />
    );

    if (isSuccess) {
        // wait a few sec, then go to invisible

        return (
            <div className={`flex flex-col justify-center items-center gap-3 w-full max-w-[400px] h-36 bg-neutral-800 rounded-xl border border-neutral-700 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-neutral-400">Success!</p>
            </div>
        )
    }

    return (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 flex flex-col justify-between w-full max-w-[400px] h-36">
            <p className="text-neutral-300 px-4 pt-4">Join our newsletter for insights on design, web development, and digital innovation.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 px-4 pb-4" noValidate >
                <div className="relative w-full">
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading || isSuccess}
                        aria-invalid={!!error}
                        aria-describedby={error ? 'email-error' : undefined}
                        className={`w-full px-4 py-2 text-[16px] text-neutral-500 bg-[rgba(255,255,255,0.05)] rounded-full
                                    ${error ? "border border-red-800" : "border border-transparent"}
                                    `}
                    />
                    {error && (
                        <div
                            className="absolute top-11 left-1/2 -translate-x-1/2 w-max max-w-[250px]
                                    rounded-md bg-neutral-900 text-neutral-200 text-sm px-3 py-1 shadow-lg z-10
                                    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2
                                    after:top-0 after:w-2 after:h-2 after:bg-neutral-900
                                    after:rotate-45 after:-translate-y-1/2 after:shadow-lg"
                        >
                            {error}
                        </div>
                    )}
                </div>
                <button
                    disabled={isLoading || isSuccess}
                    className="bg-neutral-300 rounded-full px-4 py-2
                                hover:bg-neutral-400 
                                disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed
                                transition-colors duration-200"
                >
                    {isLoading ? "Loading..." : "Subscribe"}
                </button>
            </form>
        </div>
    )
}