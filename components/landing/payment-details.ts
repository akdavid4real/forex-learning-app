const accountName = process.env.EXPO_PUBLIC_PAYMENT_ACCOUNT_NAME?.trim() ?? '';
const accountNumber = process.env.EXPO_PUBLIC_PAYMENT_ACCOUNT_NUMBER?.trim() ?? '';
const bankName = process.env.EXPO_PUBLIC_PAYMENT_BANK_NAME?.trim() ?? '';
const whatsAppProofNumber = process.env.EXPO_PUBLIC_PAYMENT_WHATSAPP_NUMBER?.trim() ?? '';

export const paymentDetails = {
  accountName,
  accountNumber,
  bankName,
  whatsAppProofNumber,
  configured: Boolean(accountName && accountNumber && bankName && whatsAppProofNumber),
};
