import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEArgsObjectSchema } from './UEArgs.schema';
import { FacultyArgsObjectSchema } from './FacultyArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { FacultyLevelArgsObjectSchema } from './FacultyLevelArgs.schema';
import { ScheduleFindManySchema } from '../findManySchedule.schema';
import { CourseAssignmentCountOutputTypeArgsObjectSchema } from './CourseAssignmentCountOutputTypeArgs.schema'

export const CourseAssignmentSelectObjectSchema: z.ZodType<Prisma.CourseAssignmentSelect, z.ZodTypeDef, Prisma.CourseAssignmentSelect> = z.object({
  id: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  facultyId: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  semester: z.boolean().optional(),
  level: z.boolean().optional(),
  facultyLevel: z.union([z.boolean(), z.lazy(() => FacultyLevelArgsObjectSchema)]).optional(),
  facultyLevelId: z.boolean().optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => CourseAssignmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CourseAssignmentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  faculty: z.union([z.boolean(), z.lazy(() => FacultyArgsObjectSchema)]).optional(),
  facultyId: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  semester: z.boolean().optional(),
  level: z.boolean().optional(),
  facultyLevel: z.union([z.boolean(), z.lazy(() => FacultyLevelArgsObjectSchema)]).optional(),
  facultyLevelId: z.boolean().optional(),
  schedules: z.union([z.boolean(), z.lazy(() => ScheduleFindManySchema)]).optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => CourseAssignmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
