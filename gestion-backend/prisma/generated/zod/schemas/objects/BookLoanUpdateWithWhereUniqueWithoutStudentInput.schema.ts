import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithoutStudentInputObjectSchema } from './BookLoanUpdateWithoutStudentInput.schema';
import { BookLoanUncheckedUpdateWithoutStudentInputObjectSchema } from './BookLoanUncheckedUpdateWithoutStudentInput.schema'

export const BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanUpdateWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
export const BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutStudentInputObjectSchema)])
}).strict();
