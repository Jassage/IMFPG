import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptMinAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptMinAggregateInputType, z.ZodTypeDef, Prisma.TranscriptMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  academicYear: z.literal(true).optional(),
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
export const TranscriptMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  academicYear: z.literal(true).optional(),
  gpa: z.literal(true).optional(),
  totalCredits: z.literal(true).optional(),
  creditsEarned: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
