import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const PaymentSumAggregateInputObjectSchema: z.ZodType<Prisma.PaymentSumAggregateInputType, z.ZodTypeDef, Prisma.PaymentSumAggregateInputType> = z.object({
  amount: z.literal(true).optional()
}).strict();
export const PaymentSumAggregateInputObjectZodSchema = z.object({
  amount: z.literal(true).optional()
}).strict();
