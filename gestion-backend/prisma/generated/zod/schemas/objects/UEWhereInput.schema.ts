import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { EnumUETypeFilterObjectSchema } from './EnumUETypeFilter.schema';
import { UETypeSchema } from '../enums/UEType.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { UEPrerequisiteListRelationFilterObjectSchema } from './UEPrerequisiteListRelationFilter.schema';
import { CourseAssignmentListRelationFilterObjectSchema } from './CourseAssignmentListRelationFilter.schema';
import { GradeListRelationFilterObjectSchema } from './GradeListRelationFilter.schema';
import { RetakeListRelationFilterObjectSchema } from './RetakeListRelationFilter.schema'

export const UEWhereInputObjectSchema: z.ZodType<Prisma.UEWhereInput, z.ZodTypeDef, Prisma.UEWhereInput> = z.object({
  AND: z.union([z.lazy(() => UEWhereInputObjectSchema), z.lazy(() => UEWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEWhereInputObjectSchema), z.lazy(() => UEWhereInputObjectSchema).array()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdById: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdBy: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteListRelationFilterObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  retakes: z.lazy(() => RetakeListRelationFilterObjectSchema).optional()
}).strict();
export const UEWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => UEWhereInputObjectSchema), z.lazy(() => UEWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => UEWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => UEWhereInputObjectSchema), z.lazy(() => UEWhereInputObjectSchema).array()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  credits: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  type: z.union([z.lazy(() => EnumUETypeFilterObjectSchema), UETypeSchema]).optional(),
  passingGrade: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  objectives: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  createdById: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdBy: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  prerequisites: z.lazy(() => UEPrerequisiteListRelationFilterObjectSchema).optional(),
  requiredFor: z.lazy(() => UEPrerequisiteListRelationFilterObjectSchema).optional(),
  assignments: z.lazy(() => CourseAssignmentListRelationFilterObjectSchema).optional(),
  grades: z.lazy(() => GradeListRelationFilterObjectSchema).optional(),
  retakes: z.lazy(() => RetakeListRelationFilterObjectSchema).optional()
}).strict();
