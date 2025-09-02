import { z } from 'zod';
import { BookCreateManyInputObjectSchema } from './objects/BookCreateManyInput.schema';

export const BookCreateManySchema = z.object({ data: z.union([ BookCreateManyInputObjectSchema, z.array(BookCreateManyInputObjectSchema) ]),  })