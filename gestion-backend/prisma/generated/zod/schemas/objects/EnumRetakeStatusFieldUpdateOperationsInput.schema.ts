import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const EnumRetakeStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumRetakeStatusFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumRetakeStatusFieldUpdateOperationsInput> = z.object({
  set: RetakeStatusSchema.optional()
}).strict();
export const EnumRetakeStatusFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: RetakeStatusSchema.optional()
}).strict();
