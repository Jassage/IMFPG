import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookWhereUniqueInputObjectSchema } from './BookWhereUniqueInput.schema';
import { BookCreateWithoutBookLoansInputObjectSchema } from './BookCreateWithoutBookLoansInput.schema';
import { BookUncheckedCreateWithoutBookLoansInputObjectSchema } from './BookUncheckedCreateWithoutBookLoansInput.schema'

export const BookCreateOrConnectWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookCreateOrConnectWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookCreateOrConnectWithoutBookLoansInput> = z.object({
  where: z.lazy(() => BookWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)])
}).strict();
export const BookCreateOrConnectWithoutBookLoansInputObjectZodSchema = z.object({
  where: z.lazy(() => BookWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)])
}).strict();
