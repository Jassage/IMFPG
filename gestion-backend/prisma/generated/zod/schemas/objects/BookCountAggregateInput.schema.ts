import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookCountAggregateInputObjectSchema: z.ZodType<Prisma.BookCountAggregateInputType, z.ZodTypeDef, Prisma.BookCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  author: z.literal(true).optional(),
  isbn: z.literal(true).optional(),
  category: z.literal(true).optional(),
  faculty: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BookCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  author: z.literal(true).optional(),
  isbn: z.literal(true).optional(),
  category: z.literal(true).optional(),
  faculty: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
