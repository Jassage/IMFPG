import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentMinAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentMinAggregateInputType, z.ZodTypeDef, Prisma.MessageAttachmentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const MessageAttachmentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
