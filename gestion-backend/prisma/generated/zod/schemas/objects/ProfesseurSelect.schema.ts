import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { CourseAssignmentFindManySchema } from '../findManyCourseAssignment.schema';
import { ScheduleFindManySchema } from '../findManySchedule.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { ProfesseurCountOutputTypeArgsObjectSchema } from './ProfesseurCountOutputTypeArgs.schema'

export const ProfesseurSelectObjectSchema: z.ZodType<Prisma.ProfesseurSelect, z.ZodTypeDef, Prisma.ProfesseurSelect> = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  department: z.boolean().optional(),
  office: z.boolean().optional(),
  hireDate: z.boolean().optional(),
  status: z.boolean().optional(),
  speciality: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProfesseurCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProfesseurSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  department: z.boolean().optional(),
  office: z.boolean().optional(),
  hireDate: z.boolean().optional(),
  status: z.boolean().optional(),
  speciality: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  assignments: z.union([z.boolean(), z.lazy(() => CourseAssignmentFindManySchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProfesseurCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
