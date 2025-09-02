import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanScalarWhereInputObjectSchema } from './BookLoanScalarWhereInput.schema';
import { BookLoanUpdateManyMutationInputObjectSchema } from './BookLoanUpdateManyMutationInput.schema';
import { BookLoanUncheckedUpdateManyWithoutStudentInputObjectSchema } from './BookLoanUncheckedUpdateManyWithoutStudentInput.schema'

export const BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => BookLoanScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateManyMutationInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const BookLoanUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateManyMutationInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
