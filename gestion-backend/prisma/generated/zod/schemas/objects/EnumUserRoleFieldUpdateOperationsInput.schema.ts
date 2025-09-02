import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserRoleSchema } from '../enums/UserRole.schema'

export const EnumUserRoleFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: UserRoleSchema.optional()
}).strict();
export const EnumUserRoleFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: UserRoleSchema.optional()
}).strict();
