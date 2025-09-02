import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUncheckedCreateWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUncheckedCreateWithoutMessageInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const MessageAttachmentUncheckedCreateWithoutMessageInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
