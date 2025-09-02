import { z } from 'zod';
import { MessageWhereInputObjectSchema } from './objects/MessageWhereInput.schema';
import { MessageOrderByWithAggregationInputObjectSchema } from './objects/MessageOrderByWithAggregationInput.schema';
import { MessageScalarWhereWithAggregatesInputObjectSchema } from './objects/MessageScalarWhereWithAggregatesInput.schema';
import { MessageScalarFieldEnumSchema } from './enums/MessageScalarFieldEnum.schema';
import { MessageCountAggregateInputObjectSchema } from './objects/MessageCountAggregateInput.schema';
import { MessageMinAggregateInputObjectSchema } from './objects/MessageMinAggregateInput.schema';
import { MessageMaxAggregateInputObjectSchema } from './objects/MessageMaxAggregateInput.schema';

export const MessageGroupBySchema = z.object({ where: MessageWhereInputObjectSchema.optional(), orderBy: z.union([MessageOrderByWithAggregationInputObjectSchema, MessageOrderByWithAggregationInputObjectSchema.array()]).optional(), having: MessageScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(MessageScalarFieldEnumSchema), _count: z.union([ z.literal(true), MessageCountAggregateInputObjectSchema ]).optional(), _min: MessageMinAggregateInputObjectSchema.optional(), _max: MessageMaxAggregateInputObjectSchema.optional() })