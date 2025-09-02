import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereInputObjectSchema } from './StudentWhereInput.schema'

export const StudentScalarRelationFilterObjectSchema: z.ZodType<Prisma.StudentScalarRelationFilter, z.ZodTypeDef, Prisma.StudentScalarRelationFilter> = z.object({
  is: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
export const StudentScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => StudentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => StudentWhereInputObjectSchema).optional()
}).strict();
