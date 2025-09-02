import { z } from 'zod';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';
import { TranscriptOrderByWithAggregationInputObjectSchema } from './objects/TranscriptOrderByWithAggregationInput.schema';
import { TranscriptScalarWhereWithAggregatesInputObjectSchema } from './objects/TranscriptScalarWhereWithAggregatesInput.schema';
import { TranscriptScalarFieldEnumSchema } from './enums/TranscriptScalarFieldEnum.schema';
import { TranscriptCountAggregateInputObjectSchema } from './objects/TranscriptCountAggregateInput.schema';
import { TranscriptMinAggregateInputObjectSchema } from './objects/TranscriptMinAggregateInput.schema';
import { TranscriptMaxAggregateInputObjectSchema } from './objects/TranscriptMaxAggregateInput.schema';

export const TranscriptGroupBySchema = z.object({ where: TranscriptWhereInputObjectSchema.optional(), orderBy: z.union([TranscriptOrderByWithAggregationInputObjectSchema, TranscriptOrderByWithAggregationInputObjectSchema.array()]).optional(), having: TranscriptScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(TranscriptScalarFieldEnumSchema), _count: z.union([ z.literal(true), TranscriptCountAggregateInputObjectSchema ]).optional(), _min: TranscriptMinAggregateInputObjectSchema.optional(), _max: TranscriptMaxAggregateInputObjectSchema.optional() })