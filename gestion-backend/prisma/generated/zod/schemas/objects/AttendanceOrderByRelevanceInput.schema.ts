import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceOrderByRelevanceFieldEnumSchema } from '../enums/AttendanceOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AttendanceOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.AttendanceOrderByRelevanceInput, z.ZodTypeDef, Prisma.AttendanceOrderByRelevanceInput> = z.object({
  fields: z.union([AttendanceOrderByRelevanceFieldEnumSchema, AttendanceOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const AttendanceOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([AttendanceOrderByRelevanceFieldEnumSchema, AttendanceOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
