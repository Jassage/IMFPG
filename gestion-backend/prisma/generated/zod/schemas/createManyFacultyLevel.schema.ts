import { z } from 'zod';
import { FacultyLevelCreateManyInputObjectSchema } from './objects/FacultyLevelCreateManyInput.schema';

export const FacultyLevelCreateManySchema = z.object({ data: z.union([ FacultyLevelCreateManyInputObjectSchema, z.array(FacultyLevelCreateManyInputObjectSchema) ]),  })