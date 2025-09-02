import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
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
export const CourseAssignmentUncheckedCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
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
