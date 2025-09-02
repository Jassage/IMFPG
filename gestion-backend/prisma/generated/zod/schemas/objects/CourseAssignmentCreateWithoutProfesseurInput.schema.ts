import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { UECreateNestedOneWithoutAssignmentsInputObjectSchema } from './UECreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyCreateNestedOneWithoutAssignmentsInput.schema';
import { AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema } from './AcademicYearCreateNestedOneWithoutAssignmentsInput.schema';
import { FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema } from './FacultyLevelCreateNestedOneWithoutAssignmentsInput.schema';
import { ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema } from './ScheduleCreateNestedManyWithoutAssignmentInput.schema'

export const CourseAssignmentCreateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateWithoutProfesseurInput> = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateWithoutProfesseurInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: SemesterSchema,
  level: z.string(),
  status: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutAssignmentsInputObjectSchema),
  faculty: z.lazy(() => FacultyCreateNestedOneWithoutAssignmentsInputObjectSchema),
  academicYear: z.lazy(() => AcademicYearCreateNestedOneWithoutAssignmentsInputObjectSchema),
  facultyLevel: z.lazy(() => FacultyLevelCreateNestedOneWithoutAssignmentsInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleCreateNestedManyWithoutAssignmentInputObjectSchema).optional()
}).strict();
