import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GuardianWhereInputObjectSchema } from './GuardianWhereInput.schema'

export const GuardianListRelationFilterObjectSchema: z.ZodType<Prisma.GuardianListRelationFilter, z.ZodTypeDef, Prisma.GuardianListRelationFilter> = z.object({
  every: z.lazy(() => GuardianWhereInputObjectSchema).optional(),
  some: z.lazy(() => GuardianWhereInputObjectSchema).optional(),
  none: z.lazy(() => GuardianWhereInputObjectSchema).optional()
}).strict();
export const GuardianListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => GuardianWhereInputObjectSchema).optional(),
  some: z.lazy(() => GuardianWhereInputObjectSchema).optional(),
  none: z.lazy(() => GuardianWhereInputObjectSchema).optional()
}).strict();
