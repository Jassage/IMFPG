import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
