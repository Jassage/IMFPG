import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { FacultyWhereInputObjectSchema } from './FacultyWhereInput.schema'

export const FacultyScalarRelationFilterObjectSchema: z.ZodType<Prisma.FacultyScalarRelationFilter, z.ZodTypeDef, Prisma.FacultyScalarRelationFilter> = z.object({
  is: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
export const FacultyScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => FacultyWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => FacultyWhereInputObjectSchema).optional()
}).strict();
