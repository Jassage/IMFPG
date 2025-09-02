import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema'

export const EnumUserStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUserStatusFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumUserStatusFieldUpdateOperationsInput> = z.object({
  set: UserStatusSchema.optional()
}).strict();
export const EnumUserStatusFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: UserStatusSchema.optional()
}).strict();
