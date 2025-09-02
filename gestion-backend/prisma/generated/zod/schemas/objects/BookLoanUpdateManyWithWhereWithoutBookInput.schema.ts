import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanScalarWhereInputObjectSchema } from './BookLoanScalarWhereInput.schema';
import { BookLoanUpdateManyMutationInputObjectSchema } from './BookLoanUpdateManyMutationInput.schema';
import { BookLoanUncheckedUpdateManyWithoutBookInputObjectSchema } from './BookLoanUncheckedUpdateManyWithoutBookInput.schema'

export const BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateManyWithWhereWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanUpdateManyWithWhereWithoutBookInput> = z.object({
  where: z.lazy(() => BookLoanScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateManyMutationInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateManyWithoutBookInputObjectSchema)])
}).strict();
export const BookLoanUpdateManyWithWhereWithoutBookInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateManyMutationInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateManyWithoutBookInputObjectSchema)])
}).strict();
