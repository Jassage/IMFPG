import { z } from 'zod';
import { FacultyLevelWhereInputObjectSchema } from './objects/FacultyLevelWhereInput.schema';
import { FacultyLevelOrderByWithAggregationInputObjectSchema } from './objects/FacultyLevelOrderByWithAggregationInput.schema';
import { FacultyLevelScalarWhereWithAggregatesInputObjectSchema } from './objects/FacultyLevelScalarWhereWithAggregatesInput.schema';
import { FacultyLevelScalarFieldEnumSchema } from './enums/FacultyLevelScalarFieldEnum.schema';
import { FacultyLevelCountAggregateInputObjectSchema } from './objects/FacultyLevelCountAggregateInput.schema';
import { FacultyLevelMinAggregateInputObjectSchema } from './objects/FacultyLevelMinAggregateInput.schema';
import { FacultyLevelMaxAggregateInputObjectSchema } from './objects/FacultyLevelMaxAggregateInput.schema';

export const FacultyLevelGroupBySchema = z.object({ where: FacultyLevelWhereInputObjectSchema.optional(), orderBy: z.union([FacultyLevelOrderByWithAggregationInputObjectSchema, FacultyLevelOrderByWithAggregationInputObjectSchema.array()]).optional(), having: FacultyLevelScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(FacultyLevelScalarFieldEnumSchema), _count: z.union([ z.literal(true), FacultyLevelCountAggregateInputObjectSchema ]).optional(), _min: FacultyLevelMinAggregateInputObjectSchema.optional(), _max: FacultyLevelMaxAggregateInputObjectSchema.optional() })