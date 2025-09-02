import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeIncludeObjectSchema } from './objects/RetakeInclude.schema';
import { RetakeCreateInputObjectSchema } from './objects/RetakeCreateInput.schema';
import { RetakeUncheckedCreateInputObjectSchema } from './objects/RetakeUncheckedCreateInput.schema';

export const RetakeCreateOneSchema = z.object({ select: RetakeSelectObjectSchema.optional(), include: RetakeIncludeObjectSchema.optional(), data: z.union([RetakeCreateInputObjectSchema, RetakeUncheckedCreateInputObjectSchema])  })