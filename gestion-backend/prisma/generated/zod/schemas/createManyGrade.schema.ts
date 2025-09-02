import { z } from 'zod';
import { GradeCreateManyInputObjectSchema } from './objects/GradeCreateManyInput.schema';

export const GradeCreateManySchema = z.object({ data: z.union([ GradeCreateManyInputObjectSchema, z.array(GradeCreateManyInputObjectSchema) ]),  })