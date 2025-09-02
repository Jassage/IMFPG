import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUncheckedCreateInput, z.ZodTypeDef, Prisma.MessageAttachmentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  messageId: z.string(),
  url: z.string()
}).strict();
export const MessageAttachmentUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  messageId: z.string(),
  url: z.string()
}).strict();
