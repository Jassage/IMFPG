import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const AnnouncementAttachmentScalarWhereInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentScalarWhereInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  announcementId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const AnnouncementAttachmentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  announcementId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
