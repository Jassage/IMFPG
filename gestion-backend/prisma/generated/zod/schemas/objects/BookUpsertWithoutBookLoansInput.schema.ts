import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookUpdateWithoutBookLoansInputObjectSchema } from './BookUpdateWithoutBookLoansInput.schema';
import { BookUncheckedUpdateWithoutBookLoansInputObjectSchema } from './BookUncheckedUpdateWithoutBookLoansInput.schema';
import { BookCreateWithoutBookLoansInputObjectSchema } from './BookCreateWithoutBookLoansInput.schema';
import { BookUncheckedCreateWithoutBookLoansInputObjectSchema } from './BookUncheckedCreateWithoutBookLoansInput.schema';
import { BookWhereInputObjectSchema } from './BookWhereInput.schema'

export const BookUpsertWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookUpsertWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookUpsertWithoutBookLoansInput> = z.object({
  update: z.union([z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)]),
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]),
  where: z.lazy(() => BookWhereInputObjectSchema).optional()
}).strict();
export const BookUpsertWithoutBookLoansInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)]),
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]),
  where: z.lazy(() => BookWhereInputObjectSchema).optional()
}).strict();
