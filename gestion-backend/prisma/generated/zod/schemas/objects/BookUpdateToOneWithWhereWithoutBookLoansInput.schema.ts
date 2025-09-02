import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookWhereInputObjectSchema } from './BookWhereInput.schema';
import { BookUpdateWithoutBookLoansInputObjectSchema } from './BookUpdateWithoutBookLoansInput.schema';
import { BookUncheckedUpdateWithoutBookLoansInputObjectSchema } from './BookUncheckedUpdateWithoutBookLoansInput.schema'

export const BookUpdateToOneWithWhereWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookUpdateToOneWithWhereWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookUpdateToOneWithWhereWithoutBookLoansInput> = z.object({
  where: z.lazy(() => BookWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)])
}).strict();
export const BookUpdateToOneWithWhereWithoutBookLoansInputObjectZodSchema = z.object({
  where: z.lazy(() => BookWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)])
}).strict();
