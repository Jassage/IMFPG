import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { MessageAttachmentIncludeObjectSchema } from './objects/MessageAttachmentInclude.schema';
import { MessageAttachmentOrderByWithRelationInputObjectSchema } from './objects/MessageAttachmentOrderByWithRelationInput.schema';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentScalarFieldEnumSchema } from './enums/MessageAttachmentScalarFieldEnum.schema';
import { MessageArgsObjectSchema } from './objects/MessageArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MessageAttachmentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MessageAttachmentSelect, z.ZodTypeDef, Prisma.MessageAttachmentSelect> = z.object({
    id: z.boolean().optional(),
    messageId: z.boolean().optional(),
    message: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const MessageAttachmentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    messageId: z.boolean().optional(),
    message: z.boolean().optional(),
    url: z.boolean().optional()
  }).strict();

export const MessageAttachmentFindFirstOrThrowSchema: z.ZodType<Prisma.MessageAttachmentFindFirstOrThrowArgs, z.ZodTypeDef, Prisma.MessageAttachmentFindFirstOrThrowArgs> = z.object({ select: MessageAttachmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => MessageAttachmentIncludeObjectSchema.optional()), orderBy: z.union([MessageAttachmentOrderByWithRelationInputObjectSchema, MessageAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageAttachmentWhereInputObjectSchema.optional(), cursor: MessageAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MessageAttachmentScalarFieldEnumSchema, MessageAttachmentScalarFieldEnumSchema.array()]).optional() }).strict();

export const MessageAttachmentFindFirstOrThrowZodSchema = z.object({ select: MessageAttachmentFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => MessageAttachmentIncludeObjectSchema.optional()), orderBy: z.union([MessageAttachmentOrderByWithRelationInputObjectSchema, MessageAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageAttachmentWhereInputObjectSchema.optional(), cursor: MessageAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MessageAttachmentScalarFieldEnumSchema, MessageAttachmentScalarFieldEnumSchema.array()]).optional() }).strict();