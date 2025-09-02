import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventParticipantOrderByRelevanceFieldEnumSchema } from '../enums/EventParticipantOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventParticipantOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.EventParticipantOrderByRelevanceInput, z.ZodTypeDef, Prisma.EventParticipantOrderByRelevanceInput> = z.object({
  fields: z.union([EventParticipantOrderByRelevanceFieldEnumSchema, EventParticipantOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const EventParticipantOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([EventParticipantOrderByRelevanceFieldEnumSchema, EventParticipantOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
