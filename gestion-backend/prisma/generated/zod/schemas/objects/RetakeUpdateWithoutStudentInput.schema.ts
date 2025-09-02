import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { EnumRetakeStatusFieldUpdateOperationsInputObjectSchema } from './EnumRetakeStatusFieldUpdateOperationsInput.schema';
import { UEUpdateOneRequiredWithoutRetakesNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutRetakesNestedInput.schema'

export const RetakeUpdateWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUpdateWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUpdateWithoutStudentInput> = z.object({
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRetakesNestedInputObjectSchema).optional()
}).strict();
export const RetakeUpdateWithoutStudentInputObjectZodSchema = z.object({
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRetakesNestedInputObjectSchema).optional()
}).strict();
