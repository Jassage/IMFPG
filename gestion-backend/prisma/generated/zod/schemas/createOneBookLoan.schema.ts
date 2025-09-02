import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanIncludeObjectSchema } from './objects/BookLoanInclude.schema';
import { BookLoanCreateInputObjectSchema } from './objects/BookLoanCreateInput.schema';
import { BookLoanUncheckedCreateInputObjectSchema } from './objects/BookLoanUncheckedCreateInput.schema';

export const BookLoanCreateOneSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), include: BookLoanIncludeObjectSchema.optional(), data: z.union([BookLoanCreateInputObjectSchema, BookLoanUncheckedCreateInputObjectSchema])  })