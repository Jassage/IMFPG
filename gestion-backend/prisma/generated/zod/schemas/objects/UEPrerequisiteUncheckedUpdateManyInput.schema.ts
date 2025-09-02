import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const UEPrerequisiteUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedUpdateManyInput> = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteUncheckedUpdateManyInputObjectZodSchema = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
