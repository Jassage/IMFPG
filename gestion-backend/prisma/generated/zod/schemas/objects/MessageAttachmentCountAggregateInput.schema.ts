import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentCountAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentCountAggregateInputType, z.ZodTypeDef, Prisma.MessageAttachmentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const MessageAttachmentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
