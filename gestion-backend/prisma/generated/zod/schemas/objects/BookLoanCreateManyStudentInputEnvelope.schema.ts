import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { BookLoanCreateManyStudentInputObjectSchema } from './BookLoanCreateManyStudentInput.schema'

export const BookLoanCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.BookLoanCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.BookLoanCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => BookLoanCreateManyStudentInputObjectSchema), z.lazy(() => BookLoanCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BookLoanCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => BookLoanCreateManyStudentInputObjectSchema), z.lazy(() => BookLoanCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
