import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { UECreateNestedOneWithoutAssignmentsInputObjectSchema } from './UECreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutAssignmentsInput.schema';
import { ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema } from './ProfesseurCreateNestedOneWithoutAssignmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateNestedOneWithoutAssignmentsInput.schema'

export const CourseAssignmentCreateWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateWithoutSchedulesInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateWithoutSchedulesInput> = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateWithoutSchedulesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  professeur: z.lazy(() => ProfesseurCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional()
}).strict();
