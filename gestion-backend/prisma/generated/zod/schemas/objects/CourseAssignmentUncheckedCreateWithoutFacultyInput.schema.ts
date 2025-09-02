import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUncheckedCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
