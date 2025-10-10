/**
 * Format a number as Brazilian Real currency
 * @param price - The price value to format
 * @returns Formatted price string (e.g., "R$ 10,50")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Format a date string to Brazilian format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "10/10/2025")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a date string with time to Brazilian format
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "10/10/2025 14:30")
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate Brazilian CPF
 * @param cpf - CPF string with or without formatting
 * @returns true if valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  cpf = cpf.replace(/\D/g, '');

  // Check if has 11 digits
  if (cpf.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Validate Brazilian phone number
 * @param phone - Phone string with or without formatting
 * @returns true if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  // Remove non-numeric characters
  phone = phone.replace(/\D/g, '');

  // Check if has 10 or 11 digits (with DDD)
  return phone.length === 10 || phone.length === 11;
}

/**
 * Validate email format
 * @param email - Email string
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Brazilian CEP (postal code)
 * @param cep - CEP string with or without formatting
 * @returns true if valid, false otherwise
 */
export function validateCEP(cep: string): boolean {
  // Remove non-numeric characters
  cep = cep.replace(/\D/g, '');

  // Check if has 8 digits
  return cep.length === 8;
}

/**
 * Calculate percentage
 * @param value - The value
 * @param total - The total
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
