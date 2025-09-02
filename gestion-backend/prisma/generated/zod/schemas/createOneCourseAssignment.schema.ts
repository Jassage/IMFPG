import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentIncludeObjectSchema } from './objects/CourseAssignmentInclude.schema';
import { CourseAssignmentCreateInputObjectSchema } from './objects/CourseAssignmentCreateInput.schema';
import { CourseAssignmentUncheckedCreateInputObjectSchema } from './objects/CourseAssignmentUncheckedCreateInput.schema';

export const CourseAssignmentCreateOneSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), include: CourseAssignmentIncludeObjectSchema.optional(), data: z.union([CourseAssignmentCreateInputObjectSchema, CourseAssignmentUncheckedCreateInputObjectSchema])  })