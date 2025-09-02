import { z } from 'zod';
import { BookLoanSelectObjectSchema } from './objects/BookLoanSelect.schema';
import { BookLoanUpdateManyMutationInputObjectSchema } from './objects/BookLoanUpdateManyMutationInput.schema';
import { BookLoanWhereInputObjectSchema } from './objects/BookLoanWhereInput.schema';

export const BookLoanUpdateManyAndReturnSchema = z.object({ select: BookLoanSelectObjectSchema.optional(), data: BookLoanUpdateManyMutationInputObjectSchema, where: BookLoanWhereInputObjectSchema.optional()  }).strict()