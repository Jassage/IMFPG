import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeCreateManyUeInputObjectSchema: z.ZodType<Prisma.RetakeCreateManyUeInput, z.ZodTypeDef, Prisma.RetakeCreateManyUeInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeCreateManyUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
