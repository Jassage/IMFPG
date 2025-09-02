import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateManyBookInputObjectSchema } from './BookLoanCreateManyBookInput.schema'

export const BookLoanCreateManyBookInputEnvelopeObjectSchema: z.ZodType<Prisma.BookLoanCreateManyBookInputEnvelope, z.ZodTypeDef, Prisma.BookLoanCreateManyBookInputEnvelope> = z.object({
  data: z.union([z.lazy(() => BookLoanCreateManyBookInputObjectSchema), z.lazy(() => BookLoanCreateManyBookInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BookLoanCreateManyBookInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => BookLoanCreateManyBookInputObjectSchema), z.lazy(() => BookLoanCreateManyBookInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
