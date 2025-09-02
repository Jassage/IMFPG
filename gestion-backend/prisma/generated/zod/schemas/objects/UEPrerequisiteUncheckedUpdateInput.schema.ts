import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const UEPrerequisiteUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedUpdateInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedUpdateInput> = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteUncheckedUpdateInputObjectZodSchema = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
