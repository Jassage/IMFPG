import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const GuardianWhereInputObjectSchema: z.ZodType<Prisma.GuardianWhereInput, z.ZodTypeDef, Prisma.GuardianWhereInput> = z.object({
  AND: z.union([z.lazy(() => GuardianWhereInputObjectSchema), z.lazy(() => GuardianWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GuardianWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GuardianWhereInputObjectSchema), z.lazy(() => GuardianWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  relationship: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  isPrimary: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
export const GuardianWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => GuardianWhereInputObjectSchema), z.lazy(() => GuardianWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => GuardianWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => GuardianWhereInputObjectSchema), z.lazy(() => GuardianWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  firstName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  lastName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  relationship: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  isPrimary: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional()
}).strict();
