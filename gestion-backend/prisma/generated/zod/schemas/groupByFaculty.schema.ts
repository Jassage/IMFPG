import { z } from 'zod';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';
import { FacultyOrderByWithAggregationInputObjectSchema } from './objects/FacultyOrderByWithAggregationInput.schema';
import { FacultyScalarWhereWithAggregatesInputObjectSchema } from './objects/FacultyScalarWhereWithAggregatesInput.schema';
import { FacultyScalarFieldEnumSchema } from './enums/FacultyScalarFieldEnum.schema';
import { FacultyCountAggregateInputObjectSchema } from './objects/FacultyCountAggregateInput.schema';
import { FacultyMinAggregateInputObjectSchema } from './objects/FacultyMinAggregateInput.schema';
import { FacultyMaxAggregateInputObjectSchema } from './objects/FacultyMaxAggregateInput.schema';

export const FacultyGroupBySchema = z.object({ where: FacultyWhereInputObjectSchema.optional(), orderBy: z.union([FacultyOrderByWithAggregationInputObjectSchema, FacultyOrderByWithAggregationInputObjectSchema.array()]).optional(), having: FacultyScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(FacultyScalarFieldEnumSchema), _count: z.union([ z.literal(true), FacultyCountAggregateInputObjectSchema ]).optional(), _min: FacultyMinAggregateInputObjectSchema.optional(), _max: FacultyMaxAggregateInputObjectSchema.optional() })