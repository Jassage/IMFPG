import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookCreateWithoutBookLoansInputObjectSchema } from './BookCreateWithoutBookLoansInput.schema';
import { BookUncheckedCreateWithoutBookLoansInputObjectSchema } from './BookUncheckedCreateWithoutBookLoansInput.schema';
import { BookCreateOrConnectWithoutBookLoansInputObjectSchema } from './BookCreateOrConnectWithoutBookLoansInput.schema';
import { BookWhereUniqueInputObjectSchema } from './BookWhereUniqueInput.schema'

export const BookCreateNestedOneWithoutBookLoansInputObjectSchema: z.ZodType<Prisma.BookCreateNestedOneWithoutBookLoansInput, z.ZodTypeDef, Prisma.BookCreateNestedOneWithoutBookLoansInput> = z.object({
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BookCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => BookWhereUniqueInputObjectSchema).optional()
}).strict();
export const BookCreateNestedOneWithoutBookLoansInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BookCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => BookWhereUniqueInputObjectSchema).optional()
}).strict();
