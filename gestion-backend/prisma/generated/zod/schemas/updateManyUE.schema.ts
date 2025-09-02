import { z } from 'zod';
import { UEUpdateManyMutationInputObjectSchema } from './objects/UEUpdateManyMutationInput.schema';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';

export const UEUpdateManySchema = z.object({ data: UEUpdateManyMutationInputObjectSchema, where: UEWhereInputObjectSchema.optional()  })