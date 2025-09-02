import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentWhereInputObjectSchema } from './EnrollmentWhereInput.schema'

export const EnrollmentListRelationFilterObjectSchema: z.ZodType<Prisma.EnrollmentListRelationFilter, z.ZodTypeDef, Prisma.EnrollmentListRelationFilter> = z.object({
  every: z.lazy(() => EnrollmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => EnrollmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => EnrollmentWhereInputObjectSchema).optional()
}).strict();
export const EnrollmentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => EnrollmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => EnrollmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => EnrollmentWhereInputObjectSchema).optional()
}).strict();
