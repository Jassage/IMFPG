import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { UEPrerequisiteFindManySchema } from '../findManyUEPrerequisite.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { RetakeFindManySchema } from '../findManyRetake.schema';
import { UECountOutputTypeArgsObjectSchema } from './UECountOutputTypeArgs.schema'

export const UEIncludeObjectSchema: z.ZodType<Prisma.UEInclude, z.ZodTypeDef, Prisma.UEInclude> = z.object({
  createdBy: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  prerequisites: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  requiredFor: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UECountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UEIncludeObjectZodSchema = z.object({
  createdBy: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  prerequisites: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  requiredFor: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UECountOutputTypeArgsObjectSchema)]).optional()
}).strict();
