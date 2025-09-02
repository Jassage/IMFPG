import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUncheckedCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUncheckedCreateWithoutProfesseurInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUncheckedCreateWithoutProfesseurInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  facultyId: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema,
  level: z.string(),
  facultyLevelId: z.string().nullish(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  schedules: z.lazy(() => ScheduleUncheckedCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
