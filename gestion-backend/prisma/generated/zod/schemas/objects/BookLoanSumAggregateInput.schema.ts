import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanSumAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanSumAggregateInputType, z.ZodTypeDef, Prisma.BookLoanSumAggregateInputType> = z.object({
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
export const BookLoanSumAggregateInputObjectZodSchema = z.object({
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
