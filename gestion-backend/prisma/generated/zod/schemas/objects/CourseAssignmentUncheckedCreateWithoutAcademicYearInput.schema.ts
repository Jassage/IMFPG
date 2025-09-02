import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
