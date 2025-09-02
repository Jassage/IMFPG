import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanCreateWithoutStudentInputObjectSchema } from './BookLoanCreateWithoutStudentInput.schema';
import { BookLoanUncheckedCreateWithoutStudentInputObjectSchema } from './BookLoanUncheckedCreateWithoutStudentInput.schema'

export const BookLoanCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const BookLoanCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
