import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementWhereInputObjectSchema } from './AnnouncementWhereInput.schema'

export const AnnouncementScalarRelationFilterObjectSchema: z.ZodType<Prisma.AnnouncementScalarRelationFilter, z.ZodTypeDef, Prisma.AnnouncementScalarRelationFilter> = z.object({
  is: z.lazy(() => AnnouncementWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AnnouncementWhereInputObjectSchema).optional()
}).strict();
export const AnnouncementScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => AnnouncementWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AnnouncementWhereInputObjectSchema).optional()
}).strict();
