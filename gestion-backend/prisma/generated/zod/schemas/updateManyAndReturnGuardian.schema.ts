import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianUpdateManyMutationInputObjectSchema } from './objects/GuardianUpdateManyMutationInput.schema';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';

export const GuardianUpdateManyAndReturnSchema = z.object({ select: GuardianSelectObjectSchema.optional(), data: GuardianUpdateManyMutationInputObjectSchema, where: GuardianWhereInputObjectSchema.optional()  }).strict()