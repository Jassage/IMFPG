import { z } from 'zod';
import { RetakeUpdateManyMutationInputObjectSchema } from './objects/RetakeUpdateManyMutationInput.schema';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';

export const RetakeUpdateManySchema = z.object({ data: RetakeUpdateManyMutationInputObjectSchema, where: RetakeWhereInputObjectSchema.optional()  })