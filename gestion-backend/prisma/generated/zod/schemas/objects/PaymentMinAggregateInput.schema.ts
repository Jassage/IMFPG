import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentMinAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMinAggregateInputType, z.ZodTypeDef, Prisma.PaymentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  type: z.literal(true).optional(),
  moyen: z.literal(true).optional(),
  status: z.literal(true).optional(),
  paidDate: z.literal(true).optional(),
  description: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const PaymentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  type: z.literal(true).optional(),
  moyen: z.literal(true).optional(),
  status: z.literal(true).optional(),
  paidDate: z.literal(true).optional(),
  description: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
