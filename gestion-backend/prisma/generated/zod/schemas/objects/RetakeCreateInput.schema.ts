import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { StudentCreateNestedOneWithoutRetakesInputObjectSchema } from './StudentCreateNestedOneWithoutRetakesInput.schema';
import { UECreateNestedOneWithoutRetakesInputObjectSchema } from './UECreateNestedOneWithoutRetakesInput.schema'

export const RetakeCreateInputObjectSchema: z.ZodType<Prisma.RetakeCreateInput, z.ZodTypeDef, Prisma.RetakeCreateInput> = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  student: z.lazy(() => StudentCreateNestedOneWithoutRetakesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
export const RetakeCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  originalGrade: z.number(),
  retakeGrade: z.number().nullish(),
  scheduledSemester: z.string(),
  status: RetakeStatusSchema,
  student: z.lazy(() => StudentCreateNestedOneWithoutRetakesInputObjectSchema),
  ue: z.lazy(() => UECreateNestedOneWithoutRetakesInputObjectSchema)
}).strict();
