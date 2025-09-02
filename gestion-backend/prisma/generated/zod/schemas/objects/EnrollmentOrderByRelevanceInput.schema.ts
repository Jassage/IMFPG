import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentOrderByRelevanceFieldEnumSchema } from '../enums/EnrollmentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EnrollmentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.EnrollmentOrderByRelevanceInput, z.ZodTypeDef, Prisma.EnrollmentOrderByRelevanceInput> = z.object({
  fields: z.union([EnrollmentOrderByRelevanceFieldEnumSchema, EnrollmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const EnrollmentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([EnrollmentOrderByRelevanceFieldEnumSchema, EnrollmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
