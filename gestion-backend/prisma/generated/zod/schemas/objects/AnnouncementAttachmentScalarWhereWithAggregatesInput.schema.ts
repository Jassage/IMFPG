import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  announcementId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const AnnouncementAttachmentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  announcementId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
