import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { EnumRetakeStatusFieldUpdateOperationsInputObjectSchema } from './EnumRetakeStatusFieldUpdateOperationsInput.schema'

export const RetakeUncheckedUpdateWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedUpdateWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUncheckedUpdateWithoutStudentInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RetakeUncheckedUpdateWithoutStudentInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
