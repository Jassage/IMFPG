import { z } from 'zod';
import { UESelectObjectSchema } from './objects/UESelect.schema';
import { UEUpdateManyMutationInputObjectSchema } from './objects/UEUpdateManyMutationInput.schema';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';

export const UEUpdateManyAndReturnSchema = z.object({ select: UESelectObjectSchema.optional(), data: UEUpdateManyMutationInputObjectSchema, where: UEWhereInputObjectSchema.optional()  }).strict()