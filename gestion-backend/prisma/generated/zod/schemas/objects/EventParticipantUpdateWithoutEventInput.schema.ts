import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const EventParticipantUpdateWithoutEventInputObjectSchema: z.ZodType<Prisma.EventParticipantUpdateWithoutEventInput, z.ZodTypeDef, Prisma.EventParticipantUpdateWithoutEventInput> = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const EventParticipantUpdateWithoutEventInputObjectZodSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
