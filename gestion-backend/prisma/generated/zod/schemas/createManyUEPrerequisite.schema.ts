import { z } from 'zod';
import { UEPrerequisiteCreateManyInputObjectSchema } from './objects/UEPrerequisiteCreateManyInput.schema';

export const UEPrerequisiteCreateManySchema = z.object({ data: z.union([ UEPrerequisiteCreateManyInputObjectSchema, z.array(UEPrerequisiteCreateManyInputObjectSchema) ]),  })