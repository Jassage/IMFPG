import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithoutBookInputObjectSchema } from './BookLoanUpdateWithoutBookInput.schema';
import { BookLoanUncheckedUpdateWithoutBookInputObjectSchema } from './BookLoanUncheckedUpdateWithoutBookInput.schema';
import { BookLoanCreateWithoutBookInputObjectSchema } from './BookLoanCreateWithoutBookInput.schema';
import { BookLoanUncheckedCreateWithoutBookInputObjectSchema } from './BookLoanUncheckedCreateWithoutBookInput.schema'

export const BookLoanUpsertWithWhereUniqueWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanUpsertWithWhereUniqueWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanUpsertWithWhereUniqueWithoutBookInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BookLoanUpdateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutBookInputObjectSchema)]),
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema)])
}).strict();
export const BookLoanUpsertWithWhereUniqueWithoutBookInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BookLoanUpdateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutBookInputObjectSchema)]),
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema)])
}).strict();
