import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookIncludeObjectSchema } from './objects/BookInclude.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';
import { BookCreateInputObjectSchema } from './objects/BookCreateInput.schema';
import { BookUncheckedCreateInputObjectSchema } from './objects/BookUncheckedCreateInput.schema';
import { BookUpdateInputObjectSchema } from './objects/BookUpdateInput.schema';
import { BookUncheckedUpdateInputObjectSchema } from './objects/BookUncheckedUpdateInput.schema';

export const BookUpsertSchema = z.object({ select: BookSelectObjectSchema.optional(), include: BookIncludeObjectSchema.optional(), where: BookWhereUniqueInputObjectSchema, create: z.union([ BookCreateInputObjectSchema, BookUncheckedCreateInputObjectSchema ]), update: z.union([ BookUpdateInputObjectSchema, BookUncheckedUpdateInputObjectSchema ])  })