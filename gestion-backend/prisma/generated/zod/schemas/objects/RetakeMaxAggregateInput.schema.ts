import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RetakeMaxAggregateInputObjectSchema: z.ZodType<Prisma.RetakeMaxAggregateInputType, z.ZodTypeDef, Prisma.RetakeMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional(),
  scheduledSemester: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const RetakeMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional(),
  scheduledSemester: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
