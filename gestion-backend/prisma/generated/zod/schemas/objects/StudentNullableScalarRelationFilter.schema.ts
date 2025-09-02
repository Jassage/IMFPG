import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.StudentNullableScalarRelationFilter, z.ZodTypeDef, Prisma.StudentNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => StudentWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => StudentWhereInputObjectSchema).nullish()
}).strict();
export const StudentNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => StudentWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => StudentWhereInputObjectSchema).nullish()
}).strict();
