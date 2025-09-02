import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { EnumRetakeStatusFilterObjectSchema } from './EnumRetakeStatusFilter.schema';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { StudentScalarRelationFilterObjectSchema } from './StudentScalarRelationFilter.schema';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema';
import { UEScalarRelationFilterObjectSchema } from './UEScalarRelationFilter.schema';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const RetakeWhereInputObjectSchema: z.ZodType<Prisma.RetakeWhereInput, z.ZodTypeDef, Prisma.RetakeWhereInput> = z.object({
  AND: z.union([z.lazy(() => RetakeWhereInputObjectSchema), z.lazy(() => RetakeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeWhereInputObjectSchema), z.lazy(() => RetakeWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusFilterObjectSchema), RetakeStatusSchema]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional()
}).strict();
export const RetakeWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => RetakeWhereInputObjectSchema), z.lazy(() => RetakeWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RetakeWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RetakeWhereInputObjectSchema), z.lazy(() => RetakeWhereInputObjectSchema).array()]).optional(),
  studentId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ueId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalGrade: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  retakeGrade: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).nullish(),
  scheduledSemester: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => EnumRetakeStatusFilterObjectSchema), RetakeStatusSchema]).optional(),
  student: z.union([z.lazy(() => StudentScalarRelationFilterObjectSchema), z.lazy(() => StudentWhereInputObjectSchema)]).optional(),
  ue: z.union([z.lazy(() => UEScalarRelationFilterObjectSchema), z.lazy(() => UEWhereInputObjectSchema)]).optional()
}).strict();
