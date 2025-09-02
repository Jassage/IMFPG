import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { UECreateNestedOneWithoutRetakesInputObjectSchema } from './UECreateNestedOneWithoutRetakesInput.schema'

export const RetakeCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.RetakeCreateWithoutStudentInput, z.ZodTypeDef, Prisma.RetakeCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  ue: z.lazy(() => UECreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
export const RetakeCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  ue: z.lazy(() => UECreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
