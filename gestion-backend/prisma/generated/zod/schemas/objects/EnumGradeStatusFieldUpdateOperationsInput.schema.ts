import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema'

export const EnumGradeStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumGradeStatusFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumGradeStatusFieldUpdateOperationsInput> = z.object({
  set: GradeStatusSchema.optional()
}).strict();
export const EnumGradeStatusFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: GradeStatusSchema.optional()
}).strict();
