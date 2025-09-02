import { z } from 'zod';
export const ScholarshipFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  amount: z.number(),
  criteria: z.string().optional(),
  applicationDeadline: z.date(),
  academicYearId: z.string(),
  academicYear: z.unknown(),
  maxRecipients: z.number().int(),
  currentRecipients: z.number().int(),
  status: z.string(),
  applications: z.array(z.unknown())
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