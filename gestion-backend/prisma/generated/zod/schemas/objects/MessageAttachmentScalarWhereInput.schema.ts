import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema'

export const MessageAttachmentScalarWhereInputObjectSchema: z.ZodType<Prisma.MessageAttachmentScalarWhereInput, z.ZodTypeDef, Prisma.MessageAttachmentScalarWhereInput> = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  messageId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
export const MessageAttachmentScalarWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema), z.lazy(() => MessageAttachmentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  messageId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional()
}).strict();
