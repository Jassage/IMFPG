import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanAvgAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanAvgAggregateInputType, z.ZodTypeDef, Prisma.BookLoanAvgAggregateInputType> = z.object({
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
export const BookLoanAvgAggregateInputObjectZodSchema = z.object({
  renewalCount: z.literal(true).optional(),
  fine: z.literal(true).optional()
}).strict();
