import crypto from "crypto"

export const invoiceNamer = () => {
  return `COSM-${new Date().toISOString().split('T')[0]}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
};
