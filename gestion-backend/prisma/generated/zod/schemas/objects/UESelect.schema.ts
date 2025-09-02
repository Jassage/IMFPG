import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { UEPrerequisiteFindManySchema } from '../findManyUEPrerequisite.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { RetakeFindManySchema } from '../findManyRetake.schema';
import { UECountOutputTypeArgsObjectSchema } from './UECountOutputTypeArgs.schema'

export const UESelectObjectSchema: z.ZodType<Prisma.UESelect, z.ZodTypeDef, Prisma.UESelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  title: z.boolean().optional(),
  credits: z.boolean().optional(),
  type: z.boolean().optional(),
  passingGrade: z.boolean().optional(),
  description: z.boolean().optional(),
  objectives: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  createdById: z.boolean().optional(),
  prerequisites: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  requiredFor: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UECountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UESelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  title: z.boolean().optional(),
  credits: z.boolean().optional(),
  type: z.boolean().optional(),
  passingGrade: z.boolean().optional(),
  description: z.boolean().optional(),
  objectives: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  createdById: z.boolean().optional(),
  prerequisites: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  requiredFor: z.union([z.boolean(), z.lazy(() => UEPrerequisiteFindManySchema)]).optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  retakes: z.union([z.boolean(), z.lazy(() => RetakeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UECountOutputTypeArgsObjectSchema)]).optional()
}).strict();
