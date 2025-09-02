import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProfesseurScalarRelationFilter, z.ZodTypeDef, Prisma.ProfesseurScalarRelationFilter> = z.object({
  is: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
export const ProfesseurScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => ProfesseurWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ProfesseurWhereInputObjectSchema).optional()
}).strict();
