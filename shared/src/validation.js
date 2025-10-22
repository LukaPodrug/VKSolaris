import { VALIDATION_RULES, ERROR_MESSAGES } from './constants.js';

// User validation
export const validateUsername = (username) => {
  if (!username) {
    return ERROR_MESSAGES.VALIDATION.REQUIRED;
  }
  
  if (username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH) {
    return ERROR_MESSAGES.VALIDATION.USERNAME_TOO_SHORT;
  }
  
  if (username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    return `Username must be no more than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`;
  }
  
  if (!VALIDATION_RULES.USERNAME.PATTERN.test(username)) {
    return ERROR_MESSAGES.VALIDATION.USERNAME_INVALID;
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return ERROR_MESSAGES.VALIDATION.REQUIRED;
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT;
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `Password must be no more than ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`;
  }
  
  return null;
};

export const validateEmail = (email) => {
  if (!email) {
    return null; // Email is optional in many cases
  }
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return ERROR_MESSAGES.VALIDATION.EMAIL_INVALID;
  }
  
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return ERROR_MESSAGES.VALIDATION.REQUIRED;
  }
  
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return ERROR_MESSAGES.VALIDATION.NAME_TOO_SHORT;
  }
  
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return `Name must be no more than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }
  
  return null;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.VALIDATION.PASSWORDS_DONT_MATCH;
  }
  
  return null;
};

export const validateDiscountPercentage = (discount) => {
  const numDiscount = Number(discount);
  
  if (isNaN(numDiscount)) {
    return 'Discount must be a valid number';
  }
  
  if (numDiscount < VALIDATION_RULES.DISCOUNT.MIN || numDiscount > VALIDATION_RULES.DISCOUNT.MAX) {
    return ERROR_MESSAGES.VALIDATION.DISCOUNT_RANGE;
  }
  
  return null;
};

// Registration form validation
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const firstNameError = validateName(formData.firstName);
  if (firstNameError) errors.firstName = firstNameError;
  
  const lastNameError = validateName(formData.lastName);
  if (lastNameError) errors.lastName = lastNameError;
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (formData.confirmPassword !== undefined) {
    const confirmPasswordError = validatePasswordConfirmation(
      formData.password, 
      formData.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.username) {
    errors.username = ERROR_MESSAGES.VALIDATION.REQUIRED;
  }
  
  if (!formData.password) {
    errors.password = ERROR_MESSAGES.VALIDATION.REQUIRED;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};