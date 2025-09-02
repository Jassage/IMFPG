import { z } from 'zod';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';
import { GradeOrderByWithAggregationInputObjectSchema } from './objects/GradeOrderByWithAggregationInput.schema';
import { GradeScalarWhereWithAggregatesInputObjectSchema } from './objects/GradeScalarWhereWithAggregatesInput.schema';
import { GradeScalarFieldEnumSchema } from './enums/GradeScalarFieldEnum.schema';
import { GradeCountAggregateInputObjectSchema } from './objects/GradeCountAggregateInput.schema';
import { GradeMinAggregateInputObjectSchema } from './objects/GradeMinAggregateInput.schema';
import { GradeMaxAggregateInputObjectSchema } from './objects/GradeMaxAggregateInput.schema';

export const GradeGroupBySchema = z.object({ where: GradeWhereInputObjectSchema.optional(), orderBy: z.union([GradeOrderByWithAggregationInputObjectSchema, GradeOrderByWithAggregationInputObjectSchema.array()]).optional(), having: GradeScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(GradeScalarFieldEnumSchema), _count: z.union([ z.literal(true), GradeCountAggregateInputObjectSchema ]).optional(), _min: GradeMinAggregateInputObjectSchema.optional(), _max: GradeMaxAggregateInputObjectSchema.optional() })