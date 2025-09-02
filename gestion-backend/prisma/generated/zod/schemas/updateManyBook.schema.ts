import { z } from 'zod';
import { BookUpdateManyMutationInputObjectSchema } from './objects/BookUpdateManyMutationInput.schema';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';

export const BookUpdateManySchema = z.object({ data: BookUpdateManyMutationInputObjectSchema, where: BookWhereInputObjectSchema.optional()  })