import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeCreateManyInputObjectSchema: z.ZodType<Prisma.RetakeCreateManyInput, z.ZodTypeDef, Prisma.RetakeCreateManyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
