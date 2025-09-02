import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { AnnouncementAttachmentListRelationFilterObjectSchema } from './AnnouncementAttachmentListRelationFilter.schema'

export const AnnouncementWhereInputObjectSchema: z.ZodType<Prisma.AnnouncementWhereInput, z.ZodTypeDef, Prisma.AnnouncementWhereInput> = z.object({
  AND: z.union([z.lazy(() => AnnouncementWhereInputObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementWhereInputObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  authorId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  publishDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  expiryDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  targetAudience: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  priority: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  attachments: z.lazy(() => AnnouncementAttachmentListRelationFilterObjectSchema).optional()
}).strict();
export const AnnouncementWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => AnnouncementWhereInputObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AnnouncementWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AnnouncementWhereInputObjectSchema), z.lazy(() => AnnouncementWhereInputObjectSchema).array()]).optional(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  authorId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  publishDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  expiryDate: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.date()]).nullish(),
  targetAudience: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  priority: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  attachments: z.lazy(() => AnnouncementAttachmentListRelationFilterObjectSchema).optional()
}).strict();
