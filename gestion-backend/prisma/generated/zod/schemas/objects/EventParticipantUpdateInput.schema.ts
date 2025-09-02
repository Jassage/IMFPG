import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { EventUpdateOneRequiredWithoutParticipantsNestedInputObjectSchema } from './EventUpdateOneRequiredWithoutParticipantsNestedInput.schema'

export const EventParticipantUpdateInputObjectSchema: z.ZodType<Prisma.EventParticipantUpdateInput, z.ZodTypeDef, Prisma.EventParticipantUpdateInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutParticipantsNestedInputObjectSchema).optional()
}).strict();
export const EventParticipantUpdateInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutParticipantsNestedInputObjectSchema).optional()
}).strict();
