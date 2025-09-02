import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const MessageAttachmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.MessageAttachmentMaxAggregateInputType, z.ZodTypeDef, Prisma.MessageAttachmentMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const MessageAttachmentMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  messageId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
