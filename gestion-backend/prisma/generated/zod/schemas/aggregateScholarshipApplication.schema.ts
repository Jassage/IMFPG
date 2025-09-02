import { z } from 'zod';
import { ScholarshipApplicationOrderByWithRelationInputObjectSchema } from './objects/ScholarshipApplicationOrderByWithRelationInput.schema';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './objects/ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCountAggregateInputObjectSchema } from './objects/ScholarshipApplicationCountAggregateInput.schema';
import { ScholarshipApplicationMinAggregateInputObjectSchema } from './objects/ScholarshipApplicationMinAggregateInput.schema';
import { ScholarshipApplicationMaxAggregateInputObjectSchema } from './objects/ScholarshipApplicationMaxAggregateInput.schema';

export const ScholarshipApplicationAggregateSchema = z.object({ orderBy: z.union([ScholarshipApplicationOrderByWithRelationInputObjectSchema, ScholarshipApplicationOrderByWithRelationInputObjectSchema.array()]).optional(), where: ScholarshipApplicationWhereInputObjectSchema.optional(), cursor: ScholarshipApplicationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ScholarshipApplicationCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipApplicationMinAggregateInputObjectSchema.optional(), _max: ScholarshipApplicationMaxAggregateInputObjectSchema.optional() })