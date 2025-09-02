import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { EnumGradeStatusFieldUpdateOperationsInputObjectSchema } from './EnumGradeStatusFieldUpdateOperationsInput.schema';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { EnumSessionTypeFieldUpdateOperationsInputObjectSchema } from './EnumSessionTypeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema'

export const GradeUncheckedUpdateManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.GradeUncheckedUpdateManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.GradeUncheckedUpdateManyWithoutAcademicYearInput> = z.object({
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  grade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([GradeStatusSchema, z.lazy(() => EnumGradeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  session: z.union([SessionTypeSchema, z.lazy(() => EnumSessionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  transcriptId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  professeurId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish()
}).strict();
export const GradeUncheckedUpdateManyWithoutAcademicYearInputObjectZodSchema = z.object({
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  grade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([GradeStatusSchema, z.lazy(() => EnumGradeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  session: z.union([SessionTypeSchema, z.lazy(() => EnumSessionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  transcriptId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  professeurId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish()
}).strict();
