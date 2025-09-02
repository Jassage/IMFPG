import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

export const MessageAttachmentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MessageAttachmentScalarWhereWithAggregatesInput, z.ZodTypeDef, Prisma.MessageAttachmentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  messageId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const MessageAttachmentScalarWhereWithAggregatesInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  messageId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
