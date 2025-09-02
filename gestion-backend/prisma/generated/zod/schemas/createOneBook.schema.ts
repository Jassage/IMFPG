import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookIncludeObjectSchema } from './objects/BookInclude.schema';
import { BookCreateInputObjectSchema } from './objects/BookCreateInput.schema';
import { BookUncheckedCreateInputObjectSchema } from './objects/BookUncheckedCreateInput.schema';

export const BookCreateOneSchema = z.object({ select: BookSelectObjectSchema.optional(), include: BookIncludeObjectSchema.optional(), data: z.union([BookCreateInputObjectSchema, BookUncheckedCreateInputObjectSchema])  })