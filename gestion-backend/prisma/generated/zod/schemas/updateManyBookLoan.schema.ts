import { z } from 'zod';
import { BookLoanUpdateManyMutationInputObjectSchema } from './objects/BookLoanUpdateManyMutationInput.schema';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';

export const BookLoanUpdateManySchema = z.object({ data: BookLoanUpdateManyMutationInputObjectSchema, where: BookLoanWhereInputObjectSchema.optional()  })