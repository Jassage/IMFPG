import type { Prisma } from '../../../../generated/prisma';
import { z } from 'zod';
import { MessageAttachmentOrderByWithRelationInputObjectSchema } from './objects/MessageAttachmentOrderByWithRelationInput.schema';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentCountAggregateInputObjectSchema } from './objects/MessageAttachmentCountAggregateInput.schema';

export const MessageAttachmentCountSchema: z.ZodType<Prisma.MessageAttachmentCountArgs, z.ZodTypeDef, Prisma.MessageAttachmentCountArgs> = z.object({ orderBy: z.union([MessageAttachmentOrderByWithRelationInputObjectSchema, MessageAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageAttachmentWhereInputObjectSchema.optional(), cursor: MessageAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MessageAttachmentCountAggregateInputObjectSchema ]).optional() }).strict();

export const MessageAttachmentCountZodSchema = z.object({ orderBy: z.union([MessageAttachmentOrderByWithRelationInputObjectSchema, MessageAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageAttachmentWhereInputObjectSchema.optional(), cursor: MessageAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MessageAttachmentCountAggregateInputObjectSchema ]).optional() }).strict();