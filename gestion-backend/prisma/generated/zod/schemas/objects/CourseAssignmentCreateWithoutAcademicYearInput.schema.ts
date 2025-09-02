import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { UECreateNestedOneWithoutAssignmentsInputObjectSchema } from './UECreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutAssignmentsInput.schema';
import { ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateNestedOneWithoutAssignmentsInput.schema';
import { ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
