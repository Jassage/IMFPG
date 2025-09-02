import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentIncludeObjectSchema } from './objects/CourseAssignmentInclude.schema';
import { CourseAssignmentUpdateInputObjectSchema } from './objects/CourseAssignmentUpdateInput.schema';
import { CourseAssignmentUncheckedUpdateInputObjectSchema } from './objects/CourseAssignmentUncheckedUpdateInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';

export const CourseAssignmentUpdateOneSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), include: CourseAssignmentIncludeObjectSchema.optional(), data: z.union([CourseAssignmentUpdateInputObjectSchema, CourseAssignmentUncheckedUpdateInputObjectSchema]), where: CourseAssignmentWhereUniqueInputObjectSchema  })