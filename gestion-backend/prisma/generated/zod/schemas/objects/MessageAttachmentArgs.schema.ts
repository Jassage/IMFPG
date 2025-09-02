import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentSelectObjectSchema } from './MessageAttachmentSelect.schema';
import { MessageAttachmentIncludeObjectSchema } from './MessageAttachmentInclude.schema'

export const MessageAttachmentArgsObjectSchema = z.object({
  select: z.lazy(() => MessageAttachmentSelectObjectSchema).optional(),
  include: z.lazy(() => MessageAttachmentIncludeObjectSchema).optional()
}).strict();
export const MessageAttachmentArgsObjectZodSchema = z.object({
  select: z.lazy(() => MessageAttachmentSelectObjectSchema).optional(),
  include: z.lazy(() => MessageAttachmentIncludeObjectSchema).optional()
}).strict();
