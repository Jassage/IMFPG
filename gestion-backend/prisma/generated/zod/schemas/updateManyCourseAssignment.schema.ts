import { z } from 'zod';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './objects/CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';

export const CourseAssignmentUpdateManySchema = z.object({ data: CourseAssignmentUpdateManyMutationInputObjectSchema, where: CourseAssignmentWhereInputObjectSchema.optional()  })