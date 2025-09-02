import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentAvgAggregateInputObjectSchema: z.ZodType<Prisma.PaymentAvgAggregateInputType, z.ZodTypeDef, Prisma.PaymentAvgAggregateInputType> = z.object({
  amount: z.literal(true).optional()
}).strict();
export const PaymentAvgAggregateInputObjectZodSchema = z.object({
  amount: z.literal(true).optional()
}).strict();
