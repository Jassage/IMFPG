import { z } from 'zod';
import { FacultyCreateManyInputObjectSchema } from './objects/FacultyCreateManyInput.schema';

export const FacultyCreateManySchema = z.object({ data: z.union([ FacultyCreateManyInputObjectSchema, z.array(FacultyCreateManyInputObjectSchema) ]),  })