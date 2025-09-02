import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { MessageAttachmentListRelationFilterObjectSchema } from './MessageAttachmentListRelationFilter.schema'

export const MessageWhereInputObjectSchema: z.ZodType<Prisma.MessageWhereInput, z.ZodTypeDef, Prisma.MessageWhereInput> = z.object({
  AND: z.union([z.lazy(() => MessageWhereInputObjectSchema), z.lazy(() => MessageWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageWhereInputObjectSchema), z.lazy(() => MessageWhereInputObjectSchema).array()]).optional(),
  senderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  receiverId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  subject: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  timestamp: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  isRead: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  priority: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attachments: z.lazy(() => MessageAttachmentListRelationFilterObjectSchema).optional()
}).strict();
export const MessageWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => MessageWhereInputObjectSchema), z.lazy(() => MessageWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageWhereInputObjectSchema), z.lazy(() => MessageWhereInputObjectSchema).array()]).optional(),
  senderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  receiverId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  subject: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).nullish(),
  content: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  timestamp: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.date()]).optional(),
  isRead: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  priority: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attachments: z.lazy(() => MessageAttachmentListRelationFilterObjectSchema).optional()
}).strict();
