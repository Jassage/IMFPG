import { z } from 'zod';
import { UEOrderByWithRelationInputObjectSchema } from './objects/UEOrderByWithRelationInput.schema';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';
import { UEWhereUniqueInputObjectSchema } from './objects/UEWhereUniqueInput.schema';
import { UECountAggregateInputObjectSchema } from './objects/UECountAggregateInput.schema';
import { UEMinAggregateInputObjectSchema } from './objects/UEMinAggregateInput.schema';
import { UEMaxAggregateInputObjectSchema } from './objects/UEMaxAggregateInput.schema';
import { UEAvgAggregateInputObjectSchema } from './objects/UEAvgAggregateInput.schema';
import { UESumAggregateInputObjectSchema } from './objects/UESumAggregateInput.schema';

export const UEAggregateSchema = z.object({ orderBy: z.union([UEOrderByWithRelationInputObjectSchema, UEOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEWhereInputObjectSchema.optional(), cursor: UEWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), UECountAggregateInputObjectSchema ]).optional(), _min: UEMinAggregateInputObjectSchema.optional(), _max: UEMaxAggregateInputObjectSchema.optional(), _avg: UEAvgAggregateInputObjectSchema.optional(), _sum: UESumAggregateInputObjectSchema.optional() })