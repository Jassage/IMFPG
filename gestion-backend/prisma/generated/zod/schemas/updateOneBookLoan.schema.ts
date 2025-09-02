import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanIncludeObjectSchema } from './objects/BookLoanInclude.schema';
import { BookLoanUpdateInputObjectSchema } from './objects/BookLoanUpdateInput.schema';
import { BookLoanUncheckedUpdateInputObjectSchema } from './objects/BookLoanUncheckedUpdateInput.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';

export const BookLoanUpdateOneSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), include: BookLoanIncludeObjectSchema.optional(), data: z.union([BookLoanUpdateInputObjectSchema, BookLoanUncheckedUpdateInputObjectSchema]), where: BookLoanWhereUniqueInputObjectSchema  })