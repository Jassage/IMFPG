import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { EnumSemesterFieldUpdateOperationsInputObjectSchema } from './EnumSemesterFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema } from './FacultyLevelUpdateOneWithoutAssignmentsNestedInput.schema';
import { ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema } from './ScheduleUpdateManyWithoutAssignmentNestedInput.schema'

export const CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithoutAcademicYearInput> = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUpdateWithoutAcademicYearInputObjectZodSchema = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
