import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeIncludeObjectSchema } from './objects/RetakeInclude.schema';
import { RetakeUpdateInputObjectSchema } from './objects/RetakeUpdateInput.schema';
import { RetakeUncheckedUpdateInputObjectSchema } from './objects/RetakeUncheckedUpdateInput.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';

export const RetakeUpdateOneSchema = z.object({ select: RetakeSelectObjectSchema.optional(), include: RetakeIncludeObjectSchema.optional(), data: z.union([RetakeUpdateInputObjectSchema, RetakeUncheckedUpdateInputObjectSchema]), where: RetakeWhereUniqueInputObjectSchema  })