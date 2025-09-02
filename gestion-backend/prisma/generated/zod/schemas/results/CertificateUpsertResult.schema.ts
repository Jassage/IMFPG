import { z } from 'zod';
export const CertificateUpsertResultSchema = z.object({
  id: z.string(),
  student: z.unknown(),
  studentId: z.string(),
  type: z.string(),
  title: z.string(),
  issueDate: z.date(),
  validUntil: z.date().optional(),
  signedBy: z.string(),
  verificationCode: z.string(),
  status: z.string()
});