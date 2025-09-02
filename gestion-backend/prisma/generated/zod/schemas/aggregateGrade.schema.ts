import { z } from 'zod';
import { GradeOrderByWithRelationInputObjectSchema } from './objects/GradeOrderByWithRelationInput.schema';
import { GradeWhereInputObjectSchema } from './objects/GradeWhereInput.schema';
import { GradeWhereUniqueInputObjectSchema } from './objects/GradeWhereUniqueInput.schema';
import { GradeCountAggregateInputObjectSchema } from './objects/GradeCountAggregateInput.schema';
import { GradeMinAggregateInputObjectSchema } from './objects/GradeMinAggregateInput.schema';
import { GradeMaxAggregateInputObjectSchema } from './objects/GradeMaxAggregateInput.schema';
import { GradeAvgAggregateInputObjectSchema } from './objects/GradeAvgAggregateInput.schema';
import { GradeSumAggregateInputObjectSchema } from './objects/GradeSumAggregateInput.schema';

export const GradeAggregateSchema = z.object({ orderBy: z.union([GradeOrderByWithRelationInputObjectSchema, GradeOrderByWithRelationInputObjectSchema.array()]).optional(), where: GradeWhereInputObjectSchema.optional(), cursor: GradeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), GradeCountAggregateInputObjectSchema ]).optional(), _min: GradeMinAggregateInputObjectSchema.optional(), _max: GradeMaxAggregateInputObjectSchema.optional(), _avg: GradeAvgAggregateInputObjectSchema.optional(), _sum: GradeSumAggregateInputObjectSchema.optional() })