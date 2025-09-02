import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './objects/CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './objects/CourseAssignmentWhereInput.schema';

export const CourseAssignmentUpdateManyAndReturnSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), data: CourseAssignmentUpdateManyMutationInputObjectSchema, where: CourseAssignmentWhereInputObjectSchema.optional()  }).strict()