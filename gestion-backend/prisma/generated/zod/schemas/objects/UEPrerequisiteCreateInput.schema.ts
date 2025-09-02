import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateNestedOneWithoutRequiredForInputObjectSchema } from './UECreateNestedOneWithoutRequiredForInput.schema';
import { UECreateNestedOneWithoutPrerequisitesInputObjectSchema } from './UECreateNestedOneWithoutPrerequisitesInput.schema'

export const UEPrerequisiteCreateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutRequiredForInputObjectSchema),
  prerequisite: z.lazy(() => UECreateNestedOneWithoutPrerequisitesInputObjectSchema)
}).strict();
export const UEPrerequisiteCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  ue: z.lazy(() => UECreateNestedOneWithoutRequiredForInputObjectSchema),
  prerequisite: z.lazy(() => UECreateNestedOneWithoutPrerequisitesInputObjectSchema)
}).strict();
