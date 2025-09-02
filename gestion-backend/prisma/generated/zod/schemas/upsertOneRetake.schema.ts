import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeIncludeObjectSchema } from './objects/RetakeInclude.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';
import { RetakeCreateInputObjectSchema } from './objects/RetakeCreateInput.schema';
import { RetakeUncheckedCreateInputObjectSchema } from './objects/RetakeUncheckedCreateInput.schema';
import { RetakeUpdateInputObjectSchema } from './objects/RetakeUpdateInput.schema';
import { RetakeUncheckedUpdateInputObjectSchema } from './objects/RetakeUncheckedUpdateInput.schema';

export const RetakeUpsertSchema = z.object({ select: RetakeSelectObjectSchema.optional(), include: RetakeIncludeObjectSchema.optional(), where: RetakeWhereUniqueInputObjectSchema, create: z.union([ RetakeCreateInputObjectSchema, RetakeUncheckedCreateInputObjectSchema ]), update: z.union([ RetakeUpdateInputObjectSchema, RetakeUncheckedUpdateInputObjectSchema ])  })