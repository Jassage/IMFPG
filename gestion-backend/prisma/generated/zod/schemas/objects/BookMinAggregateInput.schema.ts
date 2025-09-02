import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookMinAggregateInputObjectSchema: z.ZodType<Prisma.BookMinAggregateInputType, z.ZodTypeDef, Prisma.BookMinAggregateInputType> = z.object({
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
export const BookMinAggregateInputObjectZodSchema = z.object({
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
