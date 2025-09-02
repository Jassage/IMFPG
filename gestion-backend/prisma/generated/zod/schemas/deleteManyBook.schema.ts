import { z } from 'zod';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';

export const BookDeleteManySchema = z.object({ where: BookWhereInputObjectSchema.optional()  })