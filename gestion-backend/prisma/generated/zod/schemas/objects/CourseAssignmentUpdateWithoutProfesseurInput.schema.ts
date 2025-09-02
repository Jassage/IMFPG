import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema';
import { EnumSemesterFieldUpdateOperationsInputObjectSchema } from './EnumSemesterFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './FacultyUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInput.schema';
import { FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema } from './FacultyLevelUpdateOneWithoutAssignmentsNestedInput.schema';
import { ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema } from './ScheduleUpdateManyWithoutAssignmentNestedInput.schema'

export const CourseAssignmentUpdateWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithoutProfesseurInput> = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUpdateWithoutProfesseurInputObjectZodSchema = z.object({
  semester: z.union([SemesterSchema, z.lazy(() => EnumSemesterFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  faculty: z.lazy(() => FacultyUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutAssignmentsNestedInputObjectSchema).optional(),
  facultyLevel: z.lazy(() => FacultyLevelUpdateOneWithoutAssignmentsNestedInputObjectSchema).optional(),
  schedules: z.lazy(() => ScheduleUpdateManyWithoutAssignmentNestedInputObjectSchema).optional()
}).strict();
