import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookUpdateManyMutationInputObjectSchema } from './objects/BookUpdateManyMutationInput.schema';
import { BookWhereInputObjectSchema } from './objects/BookWhereInput.schema';

export const BookUpdateManyAndReturnSchema = z.object({ select: BookSelectObjectSchema.optional(), data: BookUpdateManyMutationInputObjectSchema, where: BookWhereInputObjectSchema.optional()  }).strict()