import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateWithoutStudentInputObjectSchema } from './BookLoanCreateWithoutStudentInput.schema';
import { BookLoanUncheckedCreateWithoutStudentInputObjectSchema } from './BookLoanUncheckedCreateWithoutStudentInput.schema';
import { BookLoanCreateOrConnectWithoutStudentInputObjectSchema } from './BookLoanCreateOrConnectWithoutStudentInput.schema';
import { BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema } from './BookLoanUpsertWithWhereUniqueWithoutStudentInput.schema';
import { BookLoanCreateManyStudentInputEnvelopeObjectSchema } from './BookLoanCreateManyStudentInputEnvelope.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema } from './BookLoanUpdateWithWhereUniqueWithoutStudentInput.schema';
import { BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema } from './BookLoanUpdateManyWithWhereWithoutStudentInput.schema';
import { BookLoanScalarWhereInputObjectSchema } from './BookLoanScalarWhereInput.schema'

export const BookLoanUpdateManyWithoutStudentNestedInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateManyWithoutStudentNestedInput, z.ZodTypeDef, Prisma.BookLoanUpdateManyWithoutStudentNestedInput> = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BookLoanUpdateManyWithoutStudentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateWithoutStudentInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutStudentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutStudentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyStudentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutStudentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema), z.lazy(() => BookLoanUpdateManyWithWhereWithoutStudentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional()
}).strict();
