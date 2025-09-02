import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageArgsObjectSchema } from './MessageArgs.schema'

export const MessageAttachmentIncludeObjectSchema: z.ZodType<Prisma.MessageAttachmentInclude, z.ZodTypeDef, Prisma.MessageAttachmentInclude> = z.object({
  message: z.union([z.boolean(), z.lazy(() => MessageArgsObjectSchema)]).optional()
}).strict();
export const MessageAttachmentIncludeObjectZodSchema = z.object({
  message: z.union([z.boolean(), z.lazy(() => MessageArgsObjectSchema)]).optional()
}).strict();
