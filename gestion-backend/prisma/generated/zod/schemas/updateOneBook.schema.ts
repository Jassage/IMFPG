import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookIncludeObjectSchema } from './objects/BookInclude.schema';
import { BookUpdateInputObjectSchema } from './objects/BookUpdateInput.schema';
import { BookUncheckedUpdateInputObjectSchema } from './objects/BookUncheckedUpdateInput.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';

export const BookUpdateOneSchema = z.object({ select: BookSelectObjectSchema.optional(), include: BookIncludeObjectSchema.optional(), data: z.union([BookUpdateInputObjectSchema, BookUncheckedUpdateInputObjectSchema]), where: BookWhereUniqueInputObjectSchema  })