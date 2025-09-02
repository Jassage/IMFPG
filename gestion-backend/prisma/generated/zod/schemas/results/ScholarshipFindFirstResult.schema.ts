import { z } from 'zod';
export const ScholarshipFindFirstResultSchema = z.nullable(z.object({
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
}));