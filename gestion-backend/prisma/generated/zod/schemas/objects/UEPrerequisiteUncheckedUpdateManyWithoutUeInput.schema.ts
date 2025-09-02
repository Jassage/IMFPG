import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const UEPrerequisiteUncheckedUpdateManyWithoutUeInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedUpdateManyWithoutUeInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedUpdateManyWithoutUeInput> = z.object({
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteUncheckedUpdateManyWithoutUeInputObjectZodSchema = z.object({
  prerequisiteId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
