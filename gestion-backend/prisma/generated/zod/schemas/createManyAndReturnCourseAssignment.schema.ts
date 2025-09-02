import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentCreateManyInputObjectSchema } from './objects/CourseAssignmentCreateManyInput.schema';

export const CourseAssignmentCreateManyAndReturnSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), data: z.union([ CourseAssignmentCreateManyInputObjectSchema, z.array(CourseAssignmentCreateManyInputObjectSchema) ]),  }).strict()