import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeUncheckedCreateInputObjectSchema: z.ZodType<Prisma.RetakeUncheckedCreateInput, z.ZodTypeDef, Prisma.RetakeUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
