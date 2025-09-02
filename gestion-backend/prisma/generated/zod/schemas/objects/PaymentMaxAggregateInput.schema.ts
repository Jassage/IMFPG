import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentMaxAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMaxAggregateInputType, z.ZodTypeDef, Prisma.PaymentMaxAggregateInputType> = z.object({
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
export const PaymentMaxAggregateInputObjectZodSchema = z.object({
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
