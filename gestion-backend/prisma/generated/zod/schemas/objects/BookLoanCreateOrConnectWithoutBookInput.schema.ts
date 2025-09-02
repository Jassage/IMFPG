import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanWhereUniqueInputObjectSchema } from './BookLoanWhereUniqueInput.schema';
import { BookLoanCreateWithoutBookInputObjectSchema } from './BookLoanCreateWithoutBookInput.schema';
import { BookLoanUncheckedCreateWithoutBookInputObjectSchema } from './BookLoanUncheckedCreateWithoutBookInput.schema'

export const BookLoanCreateOrConnectWithoutBookInputObjectSchema: z.ZodType<Prisma.BookLoanCreateOrConnectWithoutBookInput, z.ZodTypeDef, Prisma.BookLoanCreateOrConnectWithoutBookInput> = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema)])
}).strict();
export const BookLoanCreateOrConnectWithoutBookInputObjectZodSchema = z.object({
  where: z.lazy(() => BookLoanWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BookLoanCreateWithoutBookInputObjectSchema), z.lazy(() => BookLoanUncheckedCreateWithoutBookInputObjectSchema)])
}).strict();
