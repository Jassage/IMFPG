import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentCreateManyMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateManyMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentCreateManyMessageInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const MessageAttachmentCreateManyMessageInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
