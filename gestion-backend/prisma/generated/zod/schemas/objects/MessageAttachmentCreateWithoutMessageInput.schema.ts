import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentCreateWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentCreateWithoutMessageInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const MessageAttachmentCreateWithoutMessageInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
