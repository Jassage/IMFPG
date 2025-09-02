import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentCreateManyMessageInputObjectSchema } from './MessageAttachmentCreateManyMessageInput.schema'

export const MessageAttachmentCreateManyMessageInputEnvelopeObjectSchema: z.ZodType<Prisma.MessageAttachmentCreateManyMessageInputEnvelope, z.ZodTypeDef, Prisma.MessageAttachmentCreateManyMessageInputEnvelope> = z.object({
  data: z.union([z.lazy(() => MessageAttachmentCreateManyMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateManyMessageInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const MessageAttachmentCreateManyMessageInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => MessageAttachmentCreateManyMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateManyMessageInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
