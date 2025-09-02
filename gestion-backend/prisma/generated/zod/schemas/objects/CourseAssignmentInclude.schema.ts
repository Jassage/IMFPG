import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEArgsObjectSchema } from './UEArgs.schema';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { FacultyLevelArgsObjectSchema } from './FacultyLevelArgs.schema';
import { ScheduleFindManySchema } from '../findManySchedule.schema';
import { CourseAssignmentCountOutputTypeArgsObjectSchema } from './CourseAssignmentCountOutputTypeArgs.schema'

export const CourseAssignmentIncludeObjectSchema: z.ZodType<Prisma.CourseAssignmentInclude, z.ZodTypeDef, Prisma.CourseAssignmentInclude> = z.object({
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  facultyLevel: z.union([z.boolean(), z.lazy(() => FacultyLevelArgsObjectSchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CourseAssignmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CourseAssignmentIncludeObjectZodSchema = z.object({
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  facultyLevel: z.union([z.boolean(), z.lazy(() => FacultyLevelArgsObjectSchema)]).optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CourseAssignmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
