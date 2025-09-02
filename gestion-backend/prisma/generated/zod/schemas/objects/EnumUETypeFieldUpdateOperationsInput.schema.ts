import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema'

export const EnumUETypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUETypeFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumUETypeFieldUpdateOperationsInput> = z.object({
  set: UETypeSchema.optional()
}).strict();
export const EnumUETypeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: UETypeSchema.optional()
}).strict();
