import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithoutStudentInputObjectSchema } from './BookLoanUpdateWithoutStudentInput.schema';
import { BookLoanUncheckedUpdateWithoutStudentInputObjectSchema } from './BookLoanUncheckedUpdateWithoutStudentInput.schema';
import { BookLoanCreateWithoutStudentInputObjectSchema } from './BookLoanCreateWithoutStudentInput.schema';
import { BookLoanUncheckedCreateWithoutStudentInputObjectSchema } from './BookLoanUncheckedCreateWithoutStudentInput.schema'

export const BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanUpsertWithWhereUniqueWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanUpsertWithWhereUniqueWithoutStudentInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BookLoanUpdateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BookLoanUpdateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutStudentInputObjectSchema)]),
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
