import { z } from 'zod';
import { CourseAssignmentCreateManyInputObjectSchema } from './objects/CourseAssignmentCreateManyInput.schema';

export const CourseAssignmentCreateManySchema = z.object({ data: z.union([ CourseAssignmentCreateManyInputObjectSchema, z.array(CourseAssignmentCreateManyInputObjectSchema) ]),  })