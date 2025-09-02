import { z } from 'zod';
import { FacultyLevelOrderByWithRelationInputObjectSchema } from './objects/FacultyLevelOrderByWithRelationInput.schema';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';
import { FacultyLevelWhereUniqueInputObjectSchema } from './objects/FacultyLevelWhereUniqueInput.schema';
import { FacultyLevelCountAggregateInputObjectSchema } from './objects/FacultyLevelCountAggregateInput.schema';
import { FacultyLevelMinAggregateInputObjectSchema } from './objects/FacultyLevelMinAggregateInput.schema';
import { FacultyLevelMaxAggregateInputObjectSchema } from './objects/FacultyLevelMaxAggregateInput.schema';

export const FacultyLevelAggregateSchema = z.object({ orderBy: z.union([FacultyLevelOrderByWithRelationInputObjectSchema, FacultyLevelOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyLevelWhereInputObjectSchema.optional(), cursor: FacultyLevelWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), FacultyLevelCountAggregateInputObjectSchema ]).optional(), _min: FacultyLevelMinAggregateInputObjectSchema.optional(), _max: FacultyLevelMaxAggregateInputObjectSchema.optional() })