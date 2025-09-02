import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const EventParticipantUncheckedUpdateManyWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUncheckedUpdateManyWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUncheckedUpdateManyWithoutEventInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EventParticipantUncheckedUpdateManyWithoutEventInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
