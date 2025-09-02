import { z } from 'zod';
import { RetakeWhereInputObjectSchema } from './objects/RetakeWhereInput.schema';

export const RetakeDeleteManySchema = z.object({ where: RetakeWhereInputObjectSchema.optional()  })