import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { MessageScalarRelationFilterObjectSchema } from './MessageScalarRelationFilter.schema';
import { MessageWhereInputObjectSchema } from './MessageWhereInput.schema'

export const MessageAttachmentWhereInputObjectSchema: z.ZodType<Prisma.MessageAttachmentWhereInput, z.ZodTypeDef, Prisma.MessageAttachmentWhereInput> = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentWhereInputObjectSchema), z.lazy(() => MessageAttachmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentWhereInputObjectSchema), z.lazy(() => MessageAttachmentWhereInputObjectSchema).array()]).optional(),
  messageId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  message: z.union([z.lazy(() => MessageScalarRelationFilterObjectSchema), z.lazy(() => MessageWhereInputObjectSchema)]).optional()
}).strict();
export const MessageAttachmentWhereInputObjectZodSchema = z.object({
  AND: z.union([z.lazy(() => MessageAttachmentWhereInputObjectSchema), z.lazy(() => MessageAttachmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MessageAttachmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MessageAttachmentWhereInputObjectSchema), z.lazy(() => MessageAttachmentWhereInputObjectSchema).array()]).optional(),
  messageId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  message: z.union([z.lazy(() => MessageScalarRelationFilterObjectSchema), z.lazy(() => MessageWhereInputObjectSchema)]).optional()
}).strict();
