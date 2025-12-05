// ID generation utilities

// Generate unique ID
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}${random}`;
};

// Generate account SID
export const generateAccountSid = (): string => {
  return `AC_${generateId()}`;
};

// Generate SMS ID
export const generateSmsId = (): string => {
  return `SMS_${generateId()}`;
};

// Generate transaction ID
export const generateTransactionId = (): string => {
  return `TXN_${generateId()}`;
};
