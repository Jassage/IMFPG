import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookWhereUniqueInputObjectSchema: z.ZodType<Prisma.BookWhereUniqueInput, z.ZodTypeDef, Prisma.BookWhereUniqueInput> = z.object({
  id: z.string(),
  isbn: z.string()
}).strict();
export const BookWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  isbn: z.string()
}).strict();
