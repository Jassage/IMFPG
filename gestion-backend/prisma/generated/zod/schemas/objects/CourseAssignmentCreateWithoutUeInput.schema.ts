import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutAssignmentsInput.schema';
import { ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateNestedOneWithoutAssignmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateNestedOneWithoutAssignmentsInput.schema';
import { ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
