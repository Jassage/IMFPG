import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutRequiredForNestedInput.schema';
import { UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutPrerequisitesNestedInput.schema'

export const UEPrerequisiteUpdateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateInput> = z.object({
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema).optional(),
  prerequisite: z.lazy(() => UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteUpdateInputObjectZodSchema = z.object({
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema).optional(),
  prerequisite: z.lazy(() => UEUpdateOneRequiredWithoutPrerequisitesNestedInputObjectSchema).optional()
}).strict();
