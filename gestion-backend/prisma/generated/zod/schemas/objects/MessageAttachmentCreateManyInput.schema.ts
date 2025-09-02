import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentCreateManyInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateManyInput, z.ZodTypeDef, Prisma.MessageAttachmentCreateManyInput> = z.object({
  id: z.string().optional(),
  messageId: z.string(),
  url: z.string()
}).strict();
export const MessageAttachmentCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  messageId: z.string(),
  url: z.string()
}).strict();
