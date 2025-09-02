import { z } from 'zod';
import { FacultyLevelSelectObjectSchema } from './objects/FacultyLevelSelect.schema';
import { FacultyLevelCreateManyInputObjectSchema } from './objects/FacultyLevelCreateManyInput.schema';

export const FacultyLevelCreateManyAndReturnSchema = z.object({ select: FacultyLevelSelectObjectSchema.optional(), data: z.union([ FacultyLevelCreateManyInputObjectSchema, z.array(FacultyLevelCreateManyInputObjectSchema) ]),  }).strict()