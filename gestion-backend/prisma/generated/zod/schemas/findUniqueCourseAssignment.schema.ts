import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentIncludeObjectSchema } from './objects/CourseAssignmentInclude.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';

export const CourseAssignmentFindUniqueSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), include: CourseAssignmentIncludeObjectSchema.optional(), where: CourseAssignmentWhereUniqueInputObjectSchema })