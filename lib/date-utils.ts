// Regular expression for YYYY, YYYY/MM/DD, and YYYY-MM-DD formats
export const DATE_REGEX = /^-?\d{1,4}(?:[/-](?:0[1-9]|1[0-2])(?:[/-](?:0[1-9]|[12]\d|3[01]))?)?$/;

export function formatHistoricalDate(date: string): string {
  if (!date) return '';

  // Remove any non-digit characters except minus sign and hyphens
  const cleaned = date.replace(/[^\d-]/g, '');
  
  // Handle the case where only minus sign exists
  if (cleaned === '-') return '-';
  
  // Split into parts (handle negative years)
  const parts = cleaned.split('-').filter(Boolean);
  const isNegative = cleaned.startsWith('-');
  
  // Handle year (don't pad with zeros)
  const year = isNegative ? `-${parts[0]}` : parts[0];
  parts.shift(); // Remove the year
  
  // Handle month and day if present
  if (parts.length > 0) {
    const month = parts[0].padStart(2, '0');
    if (parts.length > 1) {
      const day = parts[1].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return `${year}-${month}`;
  }
  
  return year;
}

export function validateHistoricalDate(date: string): boolean {
  if (!date) return true; // Empty is valid
  
  // Match formats: YYYY, -YYYY, YYYY-MM, -YYYY-MM, YYYY-MM-DD, -YYYY-MM-DD
  // Where YYYY can be any length of digits
  const yearOnlyPattern = /^-?\d+$/;
  const yearMonthPattern = /^-?\d+-(?:0[1-9]|1[0-2])$/;
  const fullDatePattern = /^-?\d+-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

  return yearOnlyPattern.test(date) || 
         yearMonthPattern.test(date) || 
         fullDatePattern.test(date);
}


// Update parseHistoricalDate to handle full dates
export function parseHistoricalDate(dateStr: string): {
  year: number;
  month?: number;
  day?: number;
} {
  // Handle empty string case
  if (!dateStr) return { year: 0 };
  
  // Split by either hyphen or forward slash, but preserve the negative sign
  const isNegative = dateStr.startsWith('-');
  // Remove the negative sign for splitting, then add it back to the year
  const cleanStr = isNegative ? dateStr.substring(1) : dateStr;
  const parts = cleanStr.split(/[-/]/);
  
  return {
    year: parseInt(isNegative ? `-${parts[0]}` : parts[0], 10),
    month: parts[1] ? parseInt(parts[1], 10) : undefined,
    day: parts[2] ? parseInt(parts[2], 10) : undefined
  };
}

export function normalizeYear(year: number): number {
  return year > 0 ? year - 1 : year;
}

export function compareDates(date1: string, date2: string): number {
  if (!date1 || !date2) return 0;
  
  const d1 = parseHistoricalDate(date1);
  const d2 = parseHistoricalDate(date2);
  
  // Simple year comparison - negative years (BCE) are naturally less than positive years (CE)
  if (d1.year !== d2.year) {
    return d1.year - d2.year;
  }
  
  // If years are equal, compare months
  if (d1.month !== undefined && d2.month !== undefined) {
    if (d1.month !== d2.month) return d1.month - d2.month;
  }
  
  // If months are equal, compare days
  if (d1.day !== undefined && d2.day !== undefined) {
    if (d1.day !== d2.day) return d1.day - d2.day;
  }
  
  return 0;
}

export function validateDateRange(start: string, end: string): boolean {
  if (!start || !end) return true; // If either date is empty, consider it valid
  return compareDates(start, end) <= 0;
}

/**
 * @param startDate - Start date in YYYY or YYYY-MM-DD format
 * @param endDate - Optional end date in YYYY or YYYY-MM-DD format
 * @returns Formatted date range string
 */
export function formatYearRange(start?: string, end?: string): string {
  if (!start) return '';
  
  const startDate = parseHistoricalDate(start);
  const endDate = end ? parseHistoricalDate(end) : null;
  
  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} ` : `${year} `; // Added CE suffix for consistency
  };
  
  const formattedStart = formatYear(startDate.year);
  const formattedEnd = endDate ? formatYear(endDate.year) : '';
    
  // If we have both dates and they're the same year, just return one year
  if (endDate && startDate.year === endDate.year) {
    return formattedStart;
  }
  
  return endDate ? `${formattedStart} - ${formattedEnd}` : formattedStart;
} 