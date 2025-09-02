import { z } from 'zod';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';
import { MessageAttachmentOrderByWithAggregationInputObjectSchema } from './objects/MessageAttachmentOrderByWithAggregationInput.schema';
import { MessageAttachmentScalarWhereWithAggregatesInputObjectSchema } from './objects/MessageAttachmentScalarWhereWithAggregatesInput.schema';
import { MessageAttachmentScalarFieldEnumSchema } from './enums/MessageAttachmentScalarFieldEnum.schema';
import { MessageAttachmentCountAggregateInputObjectSchema } from './objects/MessageAttachmentCountAggregateInput.schema';
import { MessageAttachmentMinAggregateInputObjectSchema } from './objects/MessageAttachmentMinAggregateInput.schema';
import { MessageAttachmentMaxAggregateInputObjectSchema } from './objects/MessageAttachmentMaxAggregateInput.schema';

export const MessageAttachmentGroupBySchema = z.object({ where: MessageAttachmentWhereInputObjectSchema.optional(), orderBy: z.union([MessageAttachmentOrderByWithAggregationInputObjectSchema, MessageAttachmentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: MessageAttachmentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(MessageAttachmentScalarFieldEnumSchema), _count: z.union([ z.literal(true), MessageAttachmentCountAggregateInputObjectSchema ]).optional(), _min: MessageAttachmentMinAggregateInputObjectSchema.optional(), _max: MessageAttachmentMaxAggregateInputObjectSchema.optional() })