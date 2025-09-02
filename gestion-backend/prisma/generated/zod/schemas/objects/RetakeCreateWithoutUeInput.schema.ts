import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { StudentCreateNestedOneWithoutRetakesInputObjectSchema } from './StudentCreateNestedOneWithoutRetakesInput.schema'

export const RetakeCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.RetakeCreateWithoutUeInput, z.ZodTypeDef, Prisma.RetakeCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  student: z.lazy(() => StudentCreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
export const RetakeCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  student: z.lazy(() => StudentCreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
