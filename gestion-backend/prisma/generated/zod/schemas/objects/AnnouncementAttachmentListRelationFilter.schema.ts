import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentWhereInputObjectSchema } from './AnnouncementAttachmentWhereInput.schema'

export const AnnouncementAttachmentListRelationFilterObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentListRelationFilter, z.ZodTypeDef, Prisma.AnnouncementAttachmentListRelationFilter> = z.object({
  every: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional()
}).strict();
export const AnnouncementAttachmentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).optional()
}).strict();
