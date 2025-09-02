import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInput, z.ZodTypeDef, Prisma.UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInput> = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const UEPrerequisiteUncheckedUpdateManyWithoutPrerequisiteInputObjectZodSchema = z.object({
  ueId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
