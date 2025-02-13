// lib/validation.ts
export function validateEmail(email: string): { isValid: boolean; message?: string } {
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }
  
    // Common disposable email domains
    const disposableDomains = [
      'tempmail.com', 'temp-mail.org', 'throwawaymail.com',
      'mailinator.com', 'guerrillamail.com', 'sharklasers.com'
    ];
    
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { isValid: false, message: 'Please use a non-disposable email' };
    }
  
    if (email.length > 254) {
      return { isValid: false, message: 'Email is too long' };
    }
  
    return { isValid: true };
  }