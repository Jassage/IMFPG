import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentFindManySchema } from '../findManyMessageAttachment.schema';
import { MessageCountOutputTypeArgsObjectSchema } from './MessageCountOutputTypeArgs.schema'

export const MessageIncludeObjectSchema: z.ZodType<Prisma.MessageInclude, z.ZodTypeDef, Prisma.MessageInclude> = z.object({
  attachments: z.union([z.boolean(), z.lazy(() => MessageAttachmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MessageCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MessageIncludeObjectZodSchema = z.object({
  attachments: z.union([z.boolean(), z.lazy(() => MessageAttachmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MessageCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
