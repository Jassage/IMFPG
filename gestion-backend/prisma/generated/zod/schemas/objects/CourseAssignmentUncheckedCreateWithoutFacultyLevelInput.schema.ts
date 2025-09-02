import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateWithoutFacultyLevelInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  professeurId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
