import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnumEnrollmentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumEnrollmentStatusFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumEnrollmentStatusFieldUpdateOperationsInput> = z.object({
  set: EnrollmentStatusSchema.optional()
}).strict();
export const EnumEnrollmentStatusFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: EnrollmentStatusSchema.optional()
}).strict();
