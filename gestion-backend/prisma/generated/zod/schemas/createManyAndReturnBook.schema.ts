import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookCreateManyInputObjectSchema } from './objects/BookCreateManyInput.schema';

export const BookCreateManyAndReturnSchema = z.object({ select: BookSelectObjectSchema.optional(), data: z.union([ BookCreateManyInputObjectSchema, z.array(BookCreateManyInputObjectSchema) ]),  }).strict()