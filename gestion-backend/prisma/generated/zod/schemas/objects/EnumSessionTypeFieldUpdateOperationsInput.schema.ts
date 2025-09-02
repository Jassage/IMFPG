import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SessionTypeSchema } from '../enums/SessionType.schema'

export const EnumSessionTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumSessionTypeFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumSessionTypeFieldUpdateOperationsInput> = z.object({
  set: SessionTypeSchema.optional()
}).strict();
export const EnumSessionTypeFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: SessionTypeSchema.optional()
}).strict();
