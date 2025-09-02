import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanCreateManyInputObjectSchema } from './objects/BookLoanCreateManyInput.schema';

export const BookLoanCreateManyAndReturnSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), data: z.union([ BookLoanCreateManyInputObjectSchema, z.array(BookLoanCreateManyInputObjectSchema) ]),  }).strict()