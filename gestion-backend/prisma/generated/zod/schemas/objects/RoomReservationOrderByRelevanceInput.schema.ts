import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomReservationOrderByRelevanceFieldEnumSchema } from '../enums/RoomReservationOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomReservationOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.RoomReservationOrderByRelevanceInput, z.ZodTypeDef, Prisma.RoomReservationOrderByRelevanceInput> = z.object({
  fields: z.union([RoomReservationOrderByRelevanceFieldEnumSchema, RoomReservationOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const RoomReservationOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([RoomReservationOrderByRelevanceFieldEnumSchema, RoomReservationOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
