import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanUpdateWithoutBookInputObjectSchema } from './BookLoanUpdateWithoutBookInput.schema';
import { BookLoanUncheckedUpdateWithoutBookInputObjectSchema } from './BookLoanUncheckedUpdateWithoutBookInput.schema'

export const BookLoanUpdateWithWhereUniqueWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanUpdateWithWhereUniqueWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanUpdateWithWhereUniqueWithoutBookInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutBookInputObjectSchema)])
}).strict();
export const BookLoanUpdateWithWhereUniqueWithoutBookInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BookLoanUpdateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedUpdateWithoutBookInputObjectSchema)])
}).strict();
