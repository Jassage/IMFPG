import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentOrderByRelevanceFieldEnumSchema } from '../enums/CourseAssignmentOrderByRelevanceFieldEnum.schema';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const CourseAssignmentOrderByRelevanceInputObjectSchema: z.ZodType<Prisma.CourseAssignmentOrderByRelevanceInput, z.ZodTypeDef, Prisma.CourseAssignmentOrderByRelevanceInput> = z.object({
  fields: z.union([CourseAssignmentOrderByRelevanceFieldEnumSchema, CourseAssignmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
export const CourseAssignmentOrderByRelevanceInputObjectZodSchema = z.object({
  fields: z.union([CourseAssignmentOrderByRelevanceFieldEnumSchema, CourseAssignmentOrderByRelevanceFieldEnumSchema.array()]),
  sort: SortOrderSchema,
  search: z.string()
}).strict();
