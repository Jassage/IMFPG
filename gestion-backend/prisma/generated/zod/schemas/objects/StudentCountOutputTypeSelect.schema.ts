import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const StudentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.StudentCountOutputTypeSelect, z.ZodTypeDef, Prisma.StudentCountOutputTypeSelect> = z.object({
  enrollments: z.boolean().optional(),
  guardians: z.boolean().optional(),
  grades: z.boolean().optional(),
  retakes: z.boolean().optional(),
  payments: z.boolean().optional(),
  bookLoans: z.boolean().optional(),
  transcripts: z.boolean().optional(),
  attendances: z.boolean().optional(),
  scholarshipApplications: z.boolean().optional(),
  certificates: z.boolean().optional()
}).strict();
export const StudentCountOutputTypeSelectObjectZodSchema = z.object({
  enrollments: z.boolean().optional(),
  guardians: z.boolean().optional(),
  grades: z.boolean().optional(),
  retakes: z.boolean().optional(),
  payments: z.boolean().optional(),
  bookLoans: z.boolean().optional(),
  transcripts: z.boolean().optional(),
  attendances: z.boolean().optional(),
  scholarshipApplications: z.boolean().optional(),
  certificates: z.boolean().optional()
}).strict();
