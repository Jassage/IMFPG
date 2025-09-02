import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentCountAggregateInputObjectSchema: z.ZodType<Prisma.PaymentCountAggregateInputType, z.ZodTypeDef, Prisma.PaymentCountAggregateInputType> = z.object({
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
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PaymentCountAggregateInputObjectZodSchema = z.object({
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
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
