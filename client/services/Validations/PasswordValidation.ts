export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string) {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Add at least 1 uppercase letter (A-Z)');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Add at least 1 lowercase letter (a-z)');
  }

  if (!/\d/.test(password)) {
    errors.push('Add at least 1 number (0-9)');
  }

  if (!/[^\da-zA-Z]/.test(password)) {
    errors.push('Add at least 1 special character (!@#$ etc)');
  }

  return errors;
}
