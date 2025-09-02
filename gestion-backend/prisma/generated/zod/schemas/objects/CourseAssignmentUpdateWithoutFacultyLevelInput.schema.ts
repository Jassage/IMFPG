import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { EnumSemesterFieldUpdateOperationsInputObjectSchema } from './EnumSemesterFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema } from './ScheduleUpdateManyWithoutAssignmentNestedInput.schema'

export const CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithoutFacultyLevelInput> = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUpdateWithoutFacultyLevelInputObjectZodSchema = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
