import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookCreateWithoutBookLoansInputObjectSchema } from './BookCreateWithoutBookLoansInput.schema';
import { BookUncheckedCreateWithoutBookLoansInputObjectSchema } from './BookUncheckedCreateWithoutBookLoansInput.schema';
import { BookCreateOrConnectWithoutBookLoansInputObjectSchema } from './BookCreateOrConnectWithoutBookLoansInput.schema';
import { BookUpsertWithoutBookLoansInputObjectSchema } from './BookUpsertWithoutBookLoansInput.schema';
import { BookWhereUniqueInputObjectSchema } from './BookWhereUniqueInput.schema';
import { BookUpdateToOneWithWhereWithoutBookLoansInputObjectSchema } from './BookUpdateToOneWithWhereWithoutBookLoansInput.schema';
import { BookUpdateWithoutBookLoansInputObjectSchema } from './BookUpdateWithoutBookLoansInput.schema';
import { BookUncheckedUpdateWithoutBookLoansInputObjectSchema } from './BookUncheckedUpdateWithoutBookLoansInput.schema'

export const BookUpdateOneRequiredWithoutBookLoansNestedInputObjectSchema: z.ZodType<Prisma.BookUpdateOneRequiredWithoutBookLoansNestedInput, z.ZodTypeDef, Prisma.BookUpdateOneRequiredWithoutBookLoansNestedInput> = z.object({
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BookCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  upsert: z.lazy(() => BookUpsertWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => BookWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BookUpdateToOneWithWhereWithoutBookLoansInputObjectSchema), z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)]).optional()
}).strict();
export const BookUpdateOneRequiredWithoutBookLoansNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookCreateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedCreateWithoutBookLoansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BookCreateOrConnectWithoutBookLoansInputObjectSchema).optional(),
  upsert: z.lazy(() => BookUpsertWithoutBookLoansInputObjectSchema).optional(),
  connect: z.lazy(() => BookWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BookUpdateToOneWithWhereWithoutBookLoansInputObjectSchema), z.lazy(() => BookUpdateWithoutBookLoansInputObjectSchema), z.lazy(() => BookUncheckedUpdateWithoutBookLoansInputObjectSchema)]).optional()
}).strict();
