import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookCreateManyInputObjectSchema: z.ZodType<Prisma.BookCreateManyInput, z.ZodTypeDef, Prisma.BookCreateManyInput> = z.object({
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
export const BookCreateManyInputObjectZodSchema = z.object({
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
