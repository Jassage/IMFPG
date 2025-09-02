import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentStatusSchema } from '../enums/StudentStatus.schema'

export const EnumStudentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumStudentStatusFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumStudentStatusFieldUpdateOperationsInput> = z.object({
  set: StudentStatusSchema.optional()
}).strict();
export const EnumStudentStatusFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: StudentStatusSchema.optional()
}).strict();
