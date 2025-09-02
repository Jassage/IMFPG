import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookMaxAggregateInputObjectSchema: z.ZodType<Prisma.BookMaxAggregateInputType, z.ZodTypeDef, Prisma.BookMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  author: z.literal(true).optional(),
  isbn: z.literal(true).optional(),
  category: z.literal(true).optional(),
  faculty: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
export const BookMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  author: z.literal(true).optional(),
  isbn: z.literal(true).optional(),
  category: z.literal(true).optional(),
  faculty: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional(),
  location: z.literal(true).optional(),
  status: z.literal(true).optional()
}).strict();
