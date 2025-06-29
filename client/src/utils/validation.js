// Email validation function
export const validateEmail = (email) => {
  if (!email) return false;
  // Updated regex to prevent consecutive dots in local part
  const emailRegex = /^[^\s@]+(\.[^\s@]+)*@[^\s@]+\.[^\s@]+$/;
  // Additional check to prevent consecutive dots
  if (email.includes('..')) return false;
  return emailRegex.test(email);
};

// Password validation function
export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 6;
};

// YouTube URL validation and ID extraction
export const extractYouTubeId = (url) => {
  if (!url) return null;
  
  try {
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // If no match found, try to extract ID directly (in case it's just the ID)
    if (!match) {
      // Check if it's just an 11-character video ID
      if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
      }
      return null;
    }
    
    return (match && match[2].length === 11) ? match[2] : null;
  } catch (error) {
    console.error('Error extracting YouTube ID:', error);
    return null;
  }
};

// Calculate average rating from ratings array
export const calculateAverageRating = (ratings) => {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
    return 0;
  }
  
  let sum = 0;
  let count = 0;
  
  ratings.forEach(rating => {
    let ratingValue;
    if (typeof rating === 'object' && rating !== null) {
      ratingValue = rating.rating;
    } else {
      ratingValue = rating;
    }
    
    if (ratingValue !== null && ratingValue !== undefined && !isNaN(ratingValue)) {
      sum += ratingValue;
      count++;
    }
  });
  
  return count > 0 ? sum / count : 0;
};

// Format duration from minutes to readable format
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0m';
  
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h 0m`;
};

// Calculate discounted price
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (!originalPrice || originalPrice < 0) return 0;
  if (!discountPercentage || discountPercentage < 0) return originalPrice;
  
  const discount = (discountPercentage * originalPrice) / 100;
  return Math.max(0, originalPrice - discount);
}; 