import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleOrderByRelevanceFieldEnumSchema } from '../enums/ScheduleOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.ScheduleOrderByRelevanceInput, z.ZodTypeDef, Prisma.ScheduleOrderByRelevanceInput> = z.object({
  fields: z.union([ScheduleOrderByRelevanceFieldEnumSchema, ScheduleOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const ScheduleOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([ScheduleOrderByRelevanceFieldEnumSchema, ScheduleOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
