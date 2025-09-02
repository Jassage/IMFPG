import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeIncludeObjectSchema } from './objects/RetakeInclude.schema';
import { RetakeWhereUniqueInputObjectSchema } from './objects/RetakeWhereUniqueInput.schema';

export const RetakeDeleteOneSchema = z.object({ select: RetakeSelectObjectSchema.optional(), include: RetakeIncludeObjectSchema.optional(), where: RetakeWhereUniqueInputObjectSchema  })