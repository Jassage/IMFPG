import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookLoanWhereUniqueInputObjectSchema: z.ZodType<Prisma.BookLoanWhereUniqueInput, z.ZodTypeDef, Prisma.BookLoanWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const BookLoanWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
