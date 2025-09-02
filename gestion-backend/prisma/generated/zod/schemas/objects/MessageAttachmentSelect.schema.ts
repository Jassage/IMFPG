import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageArgsObjectSchema } from './MessageArgs.schema'

export const MessageAttachmentSelectObjectSchema: z.ZodType<Prisma.MessageAttachmentSelect, z.ZodTypeDef, Prisma.MessageAttachmentSelect> = z.object({
  id: z.boolean().optional(),
  messageId: z.boolean().optional(),
  message: z.union([z.boolean(), z.lazy(() => MessageArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();
export const MessageAttachmentSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  messageId: z.boolean().optional(),
  message: z.union([z.boolean(), z.lazy(() => MessageArgsObjectSchema)]).optional(),
  url: z.boolean().optional()
}).strict();
