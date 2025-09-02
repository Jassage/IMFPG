import { z } from 'zod';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';

export const CourseAssignmentDeleteManySchema = z.object({ where: CourseAssignmentWhereInputObjectSchema.optional()  })