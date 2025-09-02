import { z } from 'zod';
export const CertificateFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});