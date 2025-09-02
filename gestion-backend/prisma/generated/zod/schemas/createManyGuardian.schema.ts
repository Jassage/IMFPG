import { z } from 'zod';
import { GuardianCreateManyInputObjectSchema } from './objects/GuardianCreateManyInput.schema';

export const GuardianCreateManySchema = z.object({ data: z.union([ GuardianCreateManyInputObjectSchema, z.array(GuardianCreateManyInputObjectSchema) ]),  })