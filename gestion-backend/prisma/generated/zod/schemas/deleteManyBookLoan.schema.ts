import { z } from 'zod';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';

export const BookLoanDeleteManySchema = z.object({ where: BookLoanWhereInputObjectSchema.optional()  })