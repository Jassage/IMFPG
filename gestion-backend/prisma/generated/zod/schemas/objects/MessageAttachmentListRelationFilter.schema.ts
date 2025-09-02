import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentWhereInputObjectSchema } from './MessageAttachmentWhereInput.schema'

export const MessageAttachmentListRelationFilterObjectSchema: z.ZodType<Prisma.MessageAttachmentListRelationFilter, z.ZodTypeDef, Prisma.MessageAttachmentListRelationFilter> = z.object({
  every: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional()
}).strict();
export const MessageAttachmentListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => MessageAttachmentWhereInputObjectSchema).optional()
}).strict();
