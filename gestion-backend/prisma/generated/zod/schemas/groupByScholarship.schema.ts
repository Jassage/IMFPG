import { z } from 'zod';
import { ScholarshipWhereInputObjectSchema } from './objects/ScholarshipWhereInput.schema';
import { ScholarshipOrderByWithAggregationInputObjectSchema } from './objects/ScholarshipOrderByWithAggregationInput.schema';
import { ScholarshipScalarWhereWithAggregatesInputObjectSchema } from './objects/ScholarshipScalarWhereWithAggregatesInput.schema';
import { ScholarshipScalarFieldEnumSchema } from './enums/ScholarshipScalarFieldEnum.schema';
import { ScholarshipCountAggregateInputObjectSchema } from './objects/ScholarshipCountAggregateInput.schema';
import { ScholarshipMinAggregateInputObjectSchema } from './objects/ScholarshipMinAggregateInput.schema';
import { ScholarshipMaxAggregateInputObjectSchema } from './objects/ScholarshipMaxAggregateInput.schema';

export const ScholarshipGroupBySchema = z.object({ where: ScholarshipWhereInputObjectSchema.optional(), orderBy: z.union([ScholarshipOrderByWithAggregationInputObjectSchema, ScholarshipOrderByWithAggregationInputObjectSchema.array()]).optional(), having: ScholarshipScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(ScholarshipScalarFieldEnumSchema), _count: z.union([ z.literal(true), ScholarshipCountAggregateInputObjectSchema ]).optional(), _min: ScholarshipMinAggregateInputObjectSchema.optional(), _max: ScholarshipMaxAggregateInputObjectSchema.optional() })