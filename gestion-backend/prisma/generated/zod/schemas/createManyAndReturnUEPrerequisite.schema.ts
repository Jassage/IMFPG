import { z } from 'zod';
import { UEPrerequisiteSelectObjectSchema } from './objects/UEPrerequisiteSelect.schema';
import { UEPrerequisiteCreateManyInputObjectSchema } from './objects/UEPrerequisiteCreateManyInput.schema';

export const UEPrerequisiteCreateManyAndReturnSchema = z.object({ select: UEPrerequisiteSelectObjectSchema.optional(), data: z.union([ UEPrerequisiteCreateManyInputObjectSchema, z.array(UEPrerequisiteCreateManyInputObjectSchema) ]),  }).strict()