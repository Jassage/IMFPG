import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyLevelWhereInputObjectSchema } from './FacultyLevelWhereInput.schema'

export const FacultyLevelNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.FacultyLevelNullableScalarRelationFilter, z.ZodTypeDef, Prisma.FacultyLevelNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => FacultyLevelWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => FacultyLevelWhereInputObjectSchema).nullish()
}).strict();
export const FacultyLevelNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => FacultyLevelWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => FacultyLevelWhereInputObjectSchema).nullish()
}).strict();
