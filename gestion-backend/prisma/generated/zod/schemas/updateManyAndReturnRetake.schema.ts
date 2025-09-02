import { z } from 'zod';
import { RetakeSelectObjectSchema } from './objects/RetakeSelect.schema';
import { RetakeUpdateManyMutationInputObjectSchema } from './objects/RetakeUpdateManyMutationInput.schema';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';

export const RetakeUpdateManyAndReturnSchema = z.object({ select: RetakeSelectObjectSchema.optional(), data: RetakeUpdateManyMutationInputObjectSchema, where: RetakeWhereInputObjectSchema.optional()  }).strict()