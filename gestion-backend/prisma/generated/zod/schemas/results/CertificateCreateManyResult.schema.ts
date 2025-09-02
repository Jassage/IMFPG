import { z } from 'zod';
export const CertificateCreateManyResultSchema = z.object({
  count: z.number()
});