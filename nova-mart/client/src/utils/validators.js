export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s+-]/g, '').slice(-10));
};

export const isValidPinCode = (pin) => {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
};
