import { User } from '../types';

// Blacklist of disposable and temporary email domains to prevent spam & fake signups
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'throwawaymail.com',
  'fakeinbox.com',
  'sharklasers.com',
  'getairmail.com',
  'dispostable.com',
  'temp-mail.org',
  'mohmal.com',
  'crazymailing.com'
]);

interface PendingOTP {
  email: string;
  code: string;
  expiresAt: number;
}

const STORAGE_USER_KEY = 'alphapitch_auth_user';
let pendingOTPState: PendingOTP | null = null;

// Validate email format and check against disposable domains
export function validateEmail(email: string): { isValid: boolean; errorKey?: 'invalidEmailError' | 'disposableEmailError' } {
  const trimmed = email.trim().toLowerCase();
  
  // RFC 5322 compliant regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, errorKey: 'invalidEmailError' };
  }

  const domain = trimmed.split('@')[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { isValid: false, errorKey: 'disposableEmailError' };
  }

  return { isValid: true };
}

// Generate 6-digit verification code with 5-minute expiration
export function generateVerificationCode(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  pendingOTPState = {
    email: cleanEmail,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  return code;
}

// Verify entered OTP code and create verified session
export function verifyOTP(email: string, code: string): { success: boolean; user?: User } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (
    !pendingOTPState ||
    pendingOTPState.email !== cleanEmail ||
    pendingOTPState.code !== cleanCode ||
    Date.now() > pendingOTPState.expiresAt
  ) {
    return { success: false };
  }

  // Create verified user
  const user: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 11),
    email: cleanEmail,
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save session:', e);
  }

  pendingOTPState = null;
  return { success: true, user };
}

// Retrieve currently active user session
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Clear user session on logout
export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_USER_KEY);
  } catch (e) {
    console.error('Logout error:', e);
  }
}
