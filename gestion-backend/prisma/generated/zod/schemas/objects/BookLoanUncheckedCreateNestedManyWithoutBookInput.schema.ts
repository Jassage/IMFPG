import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateWithoutBookInputObjectSchema } from './BookLoanCreateWithoutBookInput.schema';
import { BookLoanUncheckedCreateWithoutBookInputObjectSchema } from './BookLoanUncheckedCreateWithoutBookInput.schema';
import { BookLoanCreateOrConnectWithoutBookInputObjectSchema } from './BookLoanCreateOrConnectWithoutBookInput.schema';
import { BookLoanCreateManyBookInputEnvelopeObjectSchema } from './BookLoanCreateManyBookInputEnvelope.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema'

export const BookLoanUncheckedCreateNestedManyWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanUncheckedCreateNestedManyWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanUncheckedCreateNestedManyWithoutBookInput> = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyBookInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BookLoanUncheckedCreateNestedManyWithoutBookInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema).array(), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema), z.lazy(() => BookLoanCreateOrConnectWithoutBookInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BookLoanCreateManyBookInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BookLoanWhereUniqueInputObjectSchema), z.lazy(() => BookLoanWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
