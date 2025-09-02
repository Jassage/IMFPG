import { z } from 'zod';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';

export const GuardianDeleteManySchema = z.object({ where: GuardianWhereInputObjectSchema.optional()  })