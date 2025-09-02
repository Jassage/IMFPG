import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateNestedOneWithoutRequiredForInputObjectSchema } from './UECreateNestedOneWithoutRequiredForInput.schema'

export const UEPrerequisiteCreateWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateWithoutPrerequisiteInput> = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutRequiredForInputObjectSchema)
}).strict();
export const UEPrerequisiteCreateWithoutPrerequisiteInputObjectZodSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutRequiredForInputObjectSchema)
}).strict();
