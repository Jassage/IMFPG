import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomEquipmentOrderByRelevanceFieldEnumSchema } from '../enums/RoomEquipmentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomEquipmentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.RoomEquipmentOrderByRelevanceInput, z.ZodTypeDef, Prisma.RoomEquipmentOrderByRelevanceInput> = z.object({
  fields: z.union([RoomEquipmentOrderByRelevanceFieldEnumSchema, RoomEquipmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const RoomEquipmentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([RoomEquipmentOrderByRelevanceFieldEnumSchema, RoomEquipmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
