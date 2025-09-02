import { z } from 'zod';
import { BookLoanCreateManyInputObjectSchema } from './objects/BookLoanCreateManyInput.schema';

export const BookLoanCreateManySchema = z.object({ data: z.union([ BookLoanCreateManyInputObjectSchema, z.array(BookLoanCreateManyInputObjectSchema) ]),  })