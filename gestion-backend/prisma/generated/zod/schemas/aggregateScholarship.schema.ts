import { z } from 'zod';
import { ScholarshipOrderByWithRelationInputObjectSchema } from './objects/ScholarshipOrderByWithRelationInput.schema';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';
import { ScholarshipWhereUniqueInputObjectSchema } from './objects/ScholarshipWhereUniqueInput.schema';
import { ScholarshipCountAggregateInputObjectSchema } from './objects/ScholarshipCountAggregateInput.schema';
import { ScholarshipMinAggregateInputObjectSchema } from './objects/ScholarshipMinAggregateInput.schema';
import { ScholarshipMaxAggregateInputObjectSchema } from './objects/ScholarshipMaxAggregateInput.schema';
import { ScholarshipAvgAggregateInputObjectSchema } from './objects/ScholarshipAvgAggregateInput.schema';
import { ScholarshipSumAggregateInputObjectSchema } from './objects/ScholarshipSumAggregateInput.schema';

export const ScholarshipAggregateSchema = z.object({ orderBy: z.union([ScholarshipOrderByWithRelationInputObjectSchema, ScholarshipOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipWhereInputObjectSchema.optional(), cursor: ScholarshipWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ScholarshipCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipMinAggregateInputObjectSchema.optional(), _max: ScholarshipMaxAggregateInputObjectSchema.optional(), _avg: ScholarshipAvgAggregateInputObjectSchema.optional(), _sum: ScholarshipSumAggregateInputObjectSchema.optional() })