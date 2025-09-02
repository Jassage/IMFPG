import { z } from 'zod';
import { TranscriptOrderByWithRelationInputObjectSchema } from './objects/TranscriptOrderByWithRelationInput.schema';
import { TranscriptWhereInputObjectSchema } from './objects/TranscriptWhereInput.schema';
import { TranscriptWhereUniqueInputObjectSchema } from './objects/TranscriptWhereUniqueInput.schema';
import { TranscriptCountAggregateInputObjectSchema } from './objects/TranscriptCountAggregateInput.schema';
import { TranscriptMinAggregateInputObjectSchema } from './objects/TranscriptMinAggregateInput.schema';
import { TranscriptMaxAggregateInputObjectSchema } from './objects/TranscriptMaxAggregateInput.schema';
import { TranscriptAvgAggregateInputObjectSchema } from './objects/TranscriptAvgAggregateInput.schema';
import { TranscriptSumAggregateInputObjectSchema } from './objects/TranscriptSumAggregateInput.schema';

export const TranscriptAggregateSchema = z.object({ orderBy: z.union([TranscriptOrderByWithRelationInputObjectSchema, TranscriptOrderByWithRelationInputObjectSchema.array()]).optional(), where: TranscriptWhereInputObjectSchema.optional(), cursor: TranscriptWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), TranscriptCountAggregateInputObjectSchema ]).optional(), _min: TranscriptMinAggregateInputObjectSchema.optional(), _max: TranscriptMaxAggregateInputObjectSchema.optional(), _avg: TranscriptAvgAggregateInputObjectSchema.optional(), _sum: TranscriptSumAggregateInputObjectSchema.optional() })