import {
  validateEmail,
  validatePassword,
  extractYouTubeId,
  calculateAverageRating,
  formatDuration,
  calculateDiscountedPrice
} from '../validation.js';

describe('validateEmail', () => {
  test('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
  });

  test('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test..test@example.com')).toBe(false);
  });

  test('should return false for empty or null values', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});

describe('validatePassword', () => {
  test('should return true for passwords with 6 or more characters', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('verylongpassword')).toBe(true);
  });

  test('should return false for passwords with less than 6 characters', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('abc')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  test('should return false for null or undefined values', () => {
    expect(validatePassword(null)).toBe(false);
    expect(validatePassword(undefined)).toBe(false);
  });
});

describe('extractYouTubeId', () => {
  test('should extract YouTube ID from various URL formats', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractYouTubeId('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  test('should return the ID directly if it is already a valid YouTube ID', () => {
    expect(extractYouTubeId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  test('should return null for invalid URLs or IDs', () => {
    expect(extractYouTubeId('https://example.com')).toBe(null);
    expect(extractYouTubeId('invalid-id')).toBe(null);
    expect(extractYouTubeId('')).toBe(null);
    expect(extractYouTubeId(null)).toBe(null);
  });

  test('should handle edge cases gracefully', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=')).toBe(null);
    expect(extractYouTubeId('https://www.youtube.com/watch?v=short')).toBe(null);
  });
});

describe('calculateAverageRating', () => {
  test('should calculate average rating from array of numbers', () => {
    expect(calculateAverageRating([1, 2, 3, 4, 5])).toBe(3);
    expect(calculateAverageRating([5, 5, 5])).toBe(5);
    expect(calculateAverageRating([1, 1])).toBe(1);
  });

  test('should calculate average rating from array of objects with rating property', () => {
    const ratings = [
      { rating: 4, review: 'Great course' },
      { rating: 5, review: 'Excellent' },
      { rating: 3, review: 'Good' }
    ];
    expect(calculateAverageRating(ratings)).toBe(4);
  });

  test('should return 0 for empty or invalid inputs', () => {
    expect(calculateAverageRating([])).toBe(0);
    expect(calculateAverageRating(null)).toBe(0);
    expect(calculateAverageRating(undefined)).toBe(0);
    expect(calculateAverageRating('not an array')).toBe(0);
  });

  test('should handle mixed data types gracefully', () => {
    const ratings = [
      { rating: 4 },
      5,
      { rating: null },
      { rating: 3 }
    ];
    expect(calculateAverageRating(ratings)).toBe(4);
  });
});

describe('formatDuration', () => {
  test('should format minutes correctly', () => {
    expect(formatDuration(30)).toBe('30m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(0)).toBe('0m');
  });

  test('should format hours and minutes correctly', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(120)).toBe('2h 0m');
    expect(formatDuration(125)).toBe('2h 5m');
  });

  test('should handle edge cases', () => {
    expect(formatDuration(-5)).toBe('0m');
    expect(formatDuration(null)).toBe('0m');
    expect(formatDuration(undefined)).toBe('0m');
  });

  test('should round minutes appropriately', () => {
    expect(formatDuration(30.7)).toBe('31m');
    expect(formatDuration(90.3)).toBe('1h 30m');
  });
});

describe('calculateDiscountedPrice', () => {
  test('should calculate discounted price correctly', () => {
    expect(calculateDiscountedPrice(100, 20)).toBe(80);
    expect(calculateDiscountedPrice(50, 10)).toBe(45);
    expect(calculateDiscountedPrice(200, 50)).toBe(100);
  });

  test('should return original price when no discount is applied', () => {
    expect(calculateDiscountedPrice(100, 0)).toBe(100);
    expect(calculateDiscountedPrice(100, null)).toBe(100);
    expect(calculateDiscountedPrice(100, undefined)).toBe(100);
  });

  test('should handle edge cases', () => {
    expect(calculateDiscountedPrice(100, 100)).toBe(0);
    expect(calculateDiscountedPrice(100, 150)).toBe(0); // More than 100% discount
    expect(calculateDiscountedPrice(-50, 20)).toBe(0);
    expect(calculateDiscountedPrice(0, 20)).toBe(0);
  });

  test('should handle invalid inputs', () => {
    expect(calculateDiscountedPrice(null, 20)).toBe(0);
    expect(calculateDiscountedPrice(undefined, 20)).toBe(0);
    expect(calculateDiscountedPrice(100, -10)).toBe(100);
  });
}); 