/**
 * Value object representing a monetary amount in YNAB format (milliunits)
 */
export class Amount {
  private readonly milliunits: number;

  private constructor(milliunits: number) {
    this.milliunits = Math.round(milliunits);
  }

  /**
   * Create Amount from YNAB milliunits (e.g., -4500 = -$4.50)
   */
  static fromMilliunits(milliunits: number): Amount {
    return new Amount(milliunits);
  }

  /**
   * Create Amount from dollar value (e.g., -4.50)
   */
  static fromDollars(dollars: number): Amount {
    return new Amount(dollars * 1000);
  }

  /**
   * Create Amount from string representation (e.g., "-4.50")
   */
  static fromString(value: string): Amount {
    if (!Amount.isValid(value)) {
      throw new Error(`Invalid amount string: ${value}`);
    }
    const dollars = parseFloat(value);
    return Amount.fromDollars(dollars);
  }

  /**
   * Validate if a string represents a valid amount
   */
  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    // Remove leading/trailing whitespace
    value = value.trim();

    // Check for currency symbols or invalid characters
    if (/[$€£¥]/.test(value)) {
      return false;
    }

    // Check format with regex: optional minus, digits, optional decimal with max 2 places
    const validFormat = /^-?\d+(\.\d{1,2})?$/.test(value);
    if (!validFormat) {
      return false;
    }

    // Parse as number to ensure it's valid
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
      return false;
    }

    return true;
  }

  /**
   * Get the raw milliunit value
   */
  toMilliunits(): number {
    return this.milliunits;
  }

  /**
   * Get the dollar value
   */
  toDollars(): number {
    return this.milliunits / 1000;
  }

  /**
   * Format as currency string (e.g., "-4.50")
   */
  format(): string {
    return (this.milliunits / 1000).toFixed(2);
  }

  /**
   * Check if this amount equals another amount
   */
  equals(other: Amount): boolean {
    return this.milliunits === other.milliunits;
  }

  /**
   * Check if this amount is less than another amount
   */
  isLessThan(other: Amount): boolean {
    return this.milliunits < other.milliunits;
  }

  /**
   * Check if this amount is greater than another amount
   */
  isGreaterThan(other: Amount): boolean {
    return this.milliunits > other.milliunits;
  }

  /**
   * Check if this amount is zero
   */
  isZero(): boolean {
    return this.milliunits === 0;
  }

  /**
   * Check if this amount is negative
   */
  isNegative(): boolean {
    return this.milliunits < 0;
  }

  /**
   * Check if this amount is positive
   */
  isPositive(): boolean {
    return this.milliunits > 0;
  }
}