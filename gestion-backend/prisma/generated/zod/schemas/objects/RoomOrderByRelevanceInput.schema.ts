import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RoomOrderByRelevanceFieldEnumSchema } from '../enums/RoomOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.RoomOrderByRelevanceInput, z.ZodTypeDef, Prisma.RoomOrderByRelevanceInput> = z.object({
  fields: z.union([RoomOrderByRelevanceFieldEnumSchema, RoomOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const RoomOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([RoomOrderByRelevanceFieldEnumSchema, RoomOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
