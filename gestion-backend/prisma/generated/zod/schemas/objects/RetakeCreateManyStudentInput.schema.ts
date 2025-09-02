import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const RetakeCreateManyStudentInputObjectSchema: z.ZodType<Prisma.RetakeCreateManyStudentInput, z.ZodTypeDef, Prisma.RetakeCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
export const RetakeCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  ueId: z.string(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema
}).strict();
