import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { AnnouncementScalarRelationFilterObjectSchema } from './AnnouncementScalarRelationFilter.schema';
import { AnnouncementWhereInputObjectSchema } from './AnnouncementWhereInput.schema'

export const AnnouncementAttachmentWhereInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentWhereInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentWhereInput> = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array()]).optional(),
  announcementId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  announcement: z.union([z.lazy(() => AnnouncementScalarRelationFilterObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereInputObjectSchema).array()]).optional(),
  announcementId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  announcement: z.union([z.lazy(() => AnnouncementScalarRelationFilterObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema)]).optional()
}).strict();
