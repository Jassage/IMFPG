import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutPrerequisitesNestedInput.schema'

export const UEPrerequisiteUpdateWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateWithoutUeInput> = z.object({
  prerequisite: z.lazy(() => UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteUpdateWithoutUeInputObjectZodSchema = z.object({
  prerequisite: z.lazy(() => UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema).optional()
}).strict();
