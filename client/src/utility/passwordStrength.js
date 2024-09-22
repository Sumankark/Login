export const passwordStrength = (password) => {
  const minLengthWeak = 8; // Minimum length for weak password
  const minLengthModerate = 12; // Minimum length for moderate password

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;

  if (password.length < minLengthWeak || criteriaMet < 2) {
    return "weak"; // Fewer than 8 characters or lacking a mix of character types
  } else if (password.length < minLengthModerate || criteriaMet < 3) {
    return "moderate"; // Between 8 and 11 characters, or lacking diversity
  } else if (password.length >= minLengthModerate && criteriaMet >= 3) {
    return "strong"; // 12 or more characters with diverse character sets
  }

  return "weak"; // Default to weak
};
