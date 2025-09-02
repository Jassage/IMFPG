import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BookCountOutputTypeSelect, z.ZodTypeDef, Prisma.BookCountOutputTypeSelect> = z.object({
  bookLoans: z.boolean().optional()
}).strict();
export const BookCountOutputTypeSelectObjectZodSchema = z.object({
  bookLoans: z.boolean().optional()
}).strict();
