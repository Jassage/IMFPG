import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { EnumGradeStatusFieldUpdateOperationsInputObjectSchema } from './EnumGradeStatusFieldUpdateOperationsInput.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { EnumSessionTypeFieldUpdateOperationsInputObjectSchema } from './EnumSessionTypeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutGradesNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutGradesNestedInput.schema';
import { UEUpdateOneRequiredWithoutGradesNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutGradesNestedInput.schema';
import { AcademicYearUpdateOneRequiredWithoutGradesNestedInputObjectSchema } from './AcademicYearUpdateOneRequiredWithoutGradesNestedInput.schema';
import { TranscriptUpdateOneWithoutGradesNestedInputObjectSchema } from './TranscriptUpdateOneWithoutGradesNestedInput.schema';
import { ProfesseurUpdateOneWithoutGradesNestedInputObjectSchema } from './ProfesseurUpdateOneWithoutGradesNestedInput.schema'

export const GradeUpdateInputObjectSchema: z.ZodType<Prisma.GradeUpdateInput, z.ZodTypeDef, Prisma.GradeUpdateInput> = z.object({
  grade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([GradeStatusSchema, z.lazy(() => EnumGradeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  session: z.union([SessionTypeSchema, z.lazy(() => EnumSessionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  transcript: z.lazy(() => TranscriptUpdateOneWithoutGradesNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneWithoutGradesNestedInputObjectSchema).optional()
}).strict();
export const GradeUpdateInputObjectZodSchema = z.object({
  grade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([GradeStatusSchema, z.lazy(() => EnumGradeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  session: z.union([SessionTypeSchema, z.lazy(() => EnumSessionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  academicYear: z.lazy(() => AcademicYearUpdateOneRequiredWithoutGradesNestedInputObjectSchema).optional(),
  transcript: z.lazy(() => TranscriptUpdateOneWithoutGradesNestedInputObjectSchema).optional(),
  professeur: z.lazy(() => ProfesseurUpdateOneWithoutGradesNestedInputObjectSchema).optional()
}).strict();
