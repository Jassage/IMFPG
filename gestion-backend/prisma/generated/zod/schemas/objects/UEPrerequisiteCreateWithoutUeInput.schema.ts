import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateNestedOneWithoutPrerequisitesInputObjectSchema } from './UECreateNestedOneWithoutPrerequisitesInput.schema'

export const UEPrerequisiteCreateWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteCreateWithoutUeInput> = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  prerequisite: z.lazy(() => UECreateNestedOneWithoutPrerequisitesInputObjectSchema)
}).strict();
export const UEPrerequisiteCreateWithoutUeInputObjectZodSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  prerequisite: z.lazy(() => UECreateNestedOneWithoutPrerequisitesInputObjectSchema)
}).strict();
