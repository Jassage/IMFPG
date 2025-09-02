import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanIncludeObjectSchema } from './objects/BookLoanInclude.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';

export const BookLoanDeleteOneSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), include: BookLoanIncludeObjectSchema.optional(), where: BookLoanWhereUniqueInputObjectSchema  })