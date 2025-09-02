import { z } from 'zod';
import { BookSelectObjectSchema } from './objects/BookSelect.schema';
import { BookIncludeObjectSchema } from './objects/BookInclude.schema';
import { BookWhereUniqueInputObjectSchema } from './objects/BookWhereUniqueInput.schema';

export const BookFindUniqueSchema = z.object({ select: BookSelectObjectSchema.optional(), include: BookIncludeObjectSchema.optional(), where: BookWhereUniqueInputObjectSchema })