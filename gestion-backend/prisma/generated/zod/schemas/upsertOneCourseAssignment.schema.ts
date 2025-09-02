import { z } from 'zod';
import { CourseAssignmentSelectObjectSchema } from './objects/CourseAssignmentSelect.schema';
import { CourseAssignmentIncludeObjectSchema } from './objects/CourseAssignmentInclude.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './objects/CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateInputObjectSchema } from './objects/CourseAssignmentCreateInput.schema';
import { CourseAssignmentUncheckedCreateInputObjectSchema } from './objects/CourseAssignmentUncheckedCreateInput.schema';
import { CourseAssignmentUpdateInputObjectSchema } from './objects/CourseAssignmentUpdateInput.schema';
import { CourseAssignmentUncheckedUpdateInputObjectSchema } from './objects/CourseAssignmentUncheckedUpdateInput.schema';

export const CourseAssignmentUpsertSchema = z.object({ select: CourseAssignmentSelectObjectSchema.optional(), include: CourseAssignmentIncludeObjectSchema.optional(), where: CourseAssignmentWhereUniqueInputObjectSchema, create: z.union([ CourseAssignmentCreateInputObjectSchema, CourseAssignmentUncheckedCreateInputObjectSchema ]), update: z.union([ CourseAssignmentUpdateInputObjectSchema, CourseAssignmentUncheckedUpdateInputObjectSchema ])  })