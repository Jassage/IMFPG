import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeUncheckedCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedCreateWithoutUeInput, z.ZodTypeDef, Prisma.RetakeUncheckedCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeUncheckedCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
