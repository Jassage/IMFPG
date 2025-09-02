import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { EnumRetakeStatusFieldUpdateOperationsInputObjectSchema } from './EnumRetakeStatusFieldUpdateOperationsInput.schema'

export const RetakeUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.RetakeUncheckedUpdateManyInput> = z.object({
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const RetakeUncheckedUpdateManyInputObjectZodSchema = z.object({
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  originalGrade: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  retakeGrade: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  scheduledSemester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([RetakeStatusSchema, z.lazy(() => EnumRetakeStatusFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
