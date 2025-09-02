import { z } from 'zod';
import { GuardianSelectObjectSchema } from './objects/GuardianSelect.schema';
import { GuardianCreateManyInputObjectSchema } from './objects/GuardianCreateManyInput.schema';

export const GuardianCreateManyAndReturnSchema = z.object({ select: GuardianSelectObjectSchema.optional(), data: z.union([ GuardianCreateManyInputObjectSchema, z.array(GuardianCreateManyInputObjectSchema) ]),  }).strict()