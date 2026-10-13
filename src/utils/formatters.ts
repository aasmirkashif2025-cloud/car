/**
 * Formats a number in Pakistani currency notation (Lakhs and Crores)
 * e.g. 9850000 -> "PKR 98.50 Lac"
 * e.g. 115000000 -> "PKR 11.50 Crore"
 */
export function formatPKR(amount: number, compact: boolean = true): string {
  if (amount == null || isNaN(amount) || amount === 0) {
    return 'Price on Request';
  }

  if (!compact) {
    return `PKR ${amount.toLocaleString('en-PK')}`;
  }

  if (amount >= 10000000) {
    const crores = amount / 10000000;
    // Format to 2 decimal places, omit trailing zero if clean
    const formatted = crores.toFixed(2).replace(/\.00$/, '');
    return `PKR ${formatted} Crore`;
  }

  if (amount >= 100000) {
    const lacs = amount / 100000;
    const formatted = lacs.toFixed(2).replace(/\.00$/, '');
    return `PKR ${formatted} Lac`;
  }

  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatExactPKR(amount: number): string {
  if (amount == null || isNaN(amount)) return 'Price on Request';
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Format mileage in km (e.g. 18500 -> "18,500 km")
 */
export function formatMileage(km: number): string {
  if (km === 0) return 'Zero Meter / Delivery Mileage';
  return `${km.toLocaleString('en-US')} km`;
}

/**
 * Generate a clean direct WhatsApp link with prefilled URL-encoded message
 */
export function generateWhatsAppLink(
  phoneNumber: string, // e.g. "923008456789"
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Validates Pakistani phone numbers
 * e.g. 03001234567, +923001234567, 0321-1234567
 */
export function isValidPakistaniPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(cleaned);
}
