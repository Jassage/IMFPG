import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { MessageIncludeObjectSchema } from './objects/MessageInclude.schema';
import { MessageOrderByWithRelationInputObjectSchema } from './objects/MessageOrderByWithRelationInput.schema';
import { MessageWhereInputObjectSchema } from './objects/MessageWhereInput.schema';
import { MessageWhereUniqueInputObjectSchema } from './objects/MessageWhereUniqueInput.schema';
import { MessageScalarFieldEnumSchema } from './enums/MessageScalarFieldEnum.schema';
import { MessageAttachmentArgsObjectSchema } from './objects/MessageAttachmentArgs.schema';
import { MessageCountOutputTypeArgsObjectSchema } from './objects/MessageCountOutputTypeArgs.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MessageFindManySelectSchema: z.ZodType<Prisma.MessageSelect, z.ZodTypeDef, Prisma.MessageSelect> = z.object({
    id: z.boolean().optional(),
    senderId: z.boolean().optional(),
    receiverId: z.boolean().optional(),
    subject: z.boolean().optional(),
    content: z.boolean().optional(),
    timestamp: z.boolean().optional(),
    isRead: z.boolean().optional(),
    attachments: z.boolean().optional(),
    priority: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MessageFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    senderId: z.boolean().optional(),
    receiverId: z.boolean().optional(),
    subject: z.boolean().optional(),
    content: z.boolean().optional(),
    timestamp: z.boolean().optional(),
    isRead: z.boolean().optional(),
    attachments: z.boolean().optional(),
    priority: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MessageFindManySchema: z.ZodType<Prisma.MessageFindManyArgs, z.ZodTypeDef, Prisma.MessageFindManyArgs> = z.object({ select: MessageFindManySelectSchema.optional(), include: z.lazy(() => MessageIncludeObjectSchema.optional()), orderBy: z.union([MessageOrderByWithRelationInputObjectSchema, MessageOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageWhereInputObjectSchema.optional(), cursor: MessageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array()]).optional() }).strict();

export const MessageFindManyZodSchema = z.object({ select: MessageFindManySelectSchema.optional(), include: z.lazy(() => MessageIncludeObjectSchema.optional()), orderBy: z.union([MessageOrderByWithRelationInputObjectSchema, MessageOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageWhereInputObjectSchema.optional(), cursor: MessageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array()]).optional() }).strict();