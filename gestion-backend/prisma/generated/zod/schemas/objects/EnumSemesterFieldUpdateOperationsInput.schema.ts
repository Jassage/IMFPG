import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const EnumSemesterFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumSemesterFieldUpdateOperationsInput, z.ZodTypeDef, Prisma.EnumSemesterFieldUpdateOperationsInput> = z.object({
  set: SemesterSchema.optional()
}).strict();
export const EnumSemesterFieldUpdateOperationsInputObjectZodSchema = z.object({
  set: SemesterSchema.optional()
}).strict();
