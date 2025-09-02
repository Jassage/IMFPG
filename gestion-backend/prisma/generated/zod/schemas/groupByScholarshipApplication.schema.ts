import { z } from 'zod';
import { ScholarshipApplicationWhereInputObjectSchema } from './objects/ScholarshipApplicationWhereInput.schema';
import { ScholarshipApplicationOrderByWithAggregationInputObjectSchema } from './objects/ScholarshipApplicationOrderByWithAggregationInput.schema';
import { ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema } from './objects/ScholarshipApplicationScalarWhereWithAggregatesInput.schema';
import { ScholarshipApplicationScalarFieldEnumSchema } from './enums/ScholarshipApplicationScalarFieldEnum.schema';
import { ScholarshipApplicationCountAggregateInputObjectSchema } from './objects/ScholarshipApplicationCountAggregateInput.schema';
import { ScholarshipApplicationMinAggregateInputObjectSchema } from './objects/ScholarshipApplicationMinAggregateInput.schema';
import { ScholarshipApplicationMaxAggregateInputObjectSchema } from './objects/ScholarshipApplicationMaxAggregateInput.schema';

export const ScholarshipApplicationGroupBySchema = z.object({ where: ScholarshipApplicationWhereInputObjectSchema.optional(), orderBy: z.union([ScholarshipApplicationOrderByWithAggregationInputObjectSchema, ScholarshipApplicationOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ScholarshipApplicationScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ScholarshipApplicationScalarFieldEnumSchema), _count: z.union([ z.literal(true), ScholarshipApplicationCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipApplicationMinAggregateInputObjectSchema.optional(), _max: ScholarshipApplicationMaxAggregateInputObjectSchema.optional() })