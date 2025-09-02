import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateWithoutStudentInputObjectSchema } from './BookLoanCreateWithoutStudentInput.schema';
import { BookLoanUncheckedCreateWithoutStudentInputObjectSchema } from './BookLoanUncheckedCreateWithoutStudentInput.schema';
import { BookLoanCreateOrConnectWithoutStudentInputObjectSchema } from './BookLoanCreateOrConnectWithoutStudentInput.schema';
import { BookLoanCreateManyStudentInputEnvelopeObjectSchema } from './BookLoanCreateManyStudentInputEnvelope.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema'

export const BookLoanCreateNestedManyWithoutStudentInputObjectSchema: z.ZodType<Prisma.BookLoanCreateNestedManyWithoutStudentInput, z.ZodTypeDef, Prisma.BookLoanCreateNestedManyWithoutStudentInput> = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BookLoanCreateNestedManyWithoutStudentInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyStudentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
