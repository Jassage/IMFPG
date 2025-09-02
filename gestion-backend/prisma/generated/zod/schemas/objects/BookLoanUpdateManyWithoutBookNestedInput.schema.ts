import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateWithoutBookInputObjectSchema } from './BookLoanCreateWithoutBookInput.schema';
import { BookLoanUncheckedCreateWithoutBookInputObjectSchema } from './BookLoanUncheckedCreateWithoutBookInput.schema';
import { BookLoanCreateOrConnectWithoutBookInputObjectSchema } from './BookLoanCreateOrConnectWithoutBookInput.schema';
import { BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema } from './BookLoanUpsertWithWhereUniqueWithoutBookInput.schema';
import { BookLoanCreateManyBookInputEnvelopeObjectSchema } from './BookLoanCreateManyBookInputEnvelope.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema } from './BookLoanUpdateWithWhereUniqueWithoutBookInput.schema';
import { BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema } from './BookLoanUpdateManyWithWhereWithoutBookInput.schema';
import { BookLoanScalarWhereInputObjectSchema } from './BookLoanScalarWhereInput.schema'

export const BookLoanUpdateManyWithoutBookNestedInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateManyWithoutBookNestedInput, z.ZodTypeDef, Prisma.BookLoanUpdateManyWithoutBookNestedInput> = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyBookInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BookLoanUpdateManyWithoutBookNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyBookInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema), z.lazy(() => BookLoanUpdateManyWithWhereWithoutBookInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BookLoanScalarWhereInputObjectSchema), z.lazy(() => BookLoanScalarWhereInputObjectSchema).array()]).optional()
}).strict();
