import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema } from './UEUpdateOneRequiredWithoutRequiredForNestedInput.schema'

export const UEPrerequisiteUpdateWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUpdateWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUpdateWithoutPrerequisiteInput> = z.object({
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteUpdateWithoutPrerequisiteInputObjectZodSchema = z.object({
  ue: z.lazy(() => UEUpdateOneRequiredWithoutRequiredForNestedInputObjectSchema).optional()
}).strict();
