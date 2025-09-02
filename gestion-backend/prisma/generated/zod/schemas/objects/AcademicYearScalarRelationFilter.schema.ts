import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearWhereInputObjectSchema } from './AcademicYearWhereInput.schema'

export const AcademicYearScalarRelationFilterObjectSchema: z.ZodType<Prisma.AcademicYearScalarRelationFilter, z.ZodTypeDef, Prisma.AcademicYearScalarRelationFilter> = z.object({
  is: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
export const AcademicYearScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => AcademicYearWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AcademicYearWhereInputObjectSchema).optional()
}).strict();
