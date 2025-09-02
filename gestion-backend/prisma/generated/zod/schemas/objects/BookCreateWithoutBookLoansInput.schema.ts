import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookCreateWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookCreateWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookCreateWithoutBookLoansInput> = z.object({
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
export const BookCreateWithoutBookLoansInputObjectZodSchema = z.object({
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
