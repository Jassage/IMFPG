import { z } from 'zod';
import { GuardianUpdateManyMutationInputObjectSchema } from './objects/GuardianUpdateManyMutationInput.schema';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';

export const GuardianUpdateManySchema = z.object({ data: GuardianUpdateManyMutationInputObjectSchema, where: GuardianWhereInputObjectSchema.optional()  })