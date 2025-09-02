import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { UECreateNestedOneWithoutAssignmentsInputObjectSchema } from './UECreateNestedOneWithoutAssignmentsInput.schema';
import { ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateNestedOneWithoutAssignmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateNestedOneWithoutAssignmentsInput.schema';
import { ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
