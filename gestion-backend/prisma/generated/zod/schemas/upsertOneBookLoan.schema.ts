import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanIncludeObjectSchema } from './objects/BookLoanInclude.schema';
import { BookLoanWhereUniqueInputObjectSchema } from './objects/BookLoanWhereUniqueInput.schema';
import { BookLoanCreateInputObjectSchema } from './objects/BookLoanCreateInput.schema';
import { BookLoanUncheckedCreateInputObjectSchema } from './objects/BookLoanUncheckedCreateInput.schema';
import { BookLoanUpdateInputObjectSchema } from './objects/BookLoanUpdateInput.schema';
import { BookLoanUncheckedUpdateInputObjectSchema } from './objects/BookLoanUncheckedUpdateInput.schema';

export const BookLoanUpsertSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), include: BookLoanIncludeObjectSchema.optional(), where: BookLoanWhereUniqueInputObjectSchema, create: z.union([ BookLoanCreateInputObjectSchema, BookLoanUncheckedCreateInputObjectSchema ]), update: z.union([ BookLoanUpdateInputObjectSchema, BookLoanUncheckedUpdateInputObjectSchema ])  })