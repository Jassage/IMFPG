import { z } from 'zod';
import { MessageAttachmentOrderByWithRelationInputObjectSchema } from './objects/MessageAttachmentOrderByWithRelationInput.schema';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentCountAggregateInputObjectSchema } from './objects/MessageAttachmentCountAggregateInput.schema';
import { MessageAttachmentMinAggregateInputObjectSchema } from './objects/MessageAttachmentMinAggregateInput.schema';
import { MessageAttachmentMaxAggregateInputObjectSchema } from './objects/MessageAttachmentMaxAggregateInput.schema';

export const MessageAttachmentAggregateSchema = z.object({ orderBy: z.union([MessageAttachmentOrderByWithRelationInputObjectSchema, MessageAttachmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: MessageAttachmentWhereInputObjectSchema.optional(), cursor: MessageAttachmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), MessageAttachmentCountAggregateInputObjectSchema ]).optional(), _min: MessageAttachmentMinAggregateInputObjectSchema.optional(), _max: MessageAttachmentMaxAggregateInputObjectSchema.optional() })