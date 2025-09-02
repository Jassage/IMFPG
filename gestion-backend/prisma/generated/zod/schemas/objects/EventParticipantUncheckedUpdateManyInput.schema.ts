import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const EventParticipantUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.EventParticipantUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.EventParticipantUncheckedUpdateManyInput> = z.object({
  eventId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EventParticipantUncheckedUpdateManyInputObjectZodSchema = z.object({
  eventId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
