import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema'

export const ProfesseurNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProfesseurNullableScalarRelationFilter, z.ZodTypeDef, Prisma.ProfesseurNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProfesseurWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => ProfesseurWhereInputObjectSchema).nullish()
}).strict();
export const ProfesseurNullableScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => ProfesseurWhereInputObjectSchema).nullish(),
  isNot: z.lazy(() => ProfesseurWhereInputObjectSchema).nullish()
}).strict();
