import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookUncheckedCreateWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookUncheckedCreateWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookUncheckedCreateWithoutBookLoansInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullish(),
  category: z.string().nullish(),
  faculty: z.string().nullish(),
  quantity: z.number().int().optional(),
  available: z.number().int().optional(),
  location: z.string().nullish(),
  status: z.string()
}).strict();
export const BookUncheckedCreateWithoutBookLoansInputObjectZodSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  author: z.string(),
  isbn: z.string().nullish(),
  category: z.string().nullish(),
  faculty: z.string().nullish(),
  quantity: z.number().int().optional(),
  available: z.number().int().optional(),
  location: z.string().nullish(),
  status: z.string()
}).strict();
