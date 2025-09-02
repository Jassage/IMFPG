import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipMaxAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipMaxAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  criteria: z.literal(true).optional(),
  applicationDeadline: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const ScholarshipMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  criteria: z.literal(true).optional(),
  applicationDeadline: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  maxRecipients: z.literal(true).optional(),
  currentRecipients: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
