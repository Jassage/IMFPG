import { z } from 'zod';
import { FacultyOrderByWithRelationInputObjectSchema } from './objects/FacultyOrderByWithRelationInput.schema';
import { FacultyWhereInputObjectSchema } from './objects/FacultyWhereInput.schema';
import { FacultyWhereUniqueInputObjectSchema } from './objects/FacultyWhereUniqueInput.schema';
import { FacultyCountAggregateInputObjectSchema } from './objects/FacultyCountAggregateInput.schema';
import { FacultyMinAggregateInputObjectSchema } from './objects/FacultyMinAggregateInput.schema';
import { FacultyMaxAggregateInputObjectSchema } from './objects/FacultyMaxAggregateInput.schema';
import { FacultyAvgAggregateInputObjectSchema } from './objects/FacultyAvgAggregateInput.schema';
import { FacultySumAggregateInputObjectSchema } from './objects/FacultySumAggregateInput.schema';

export const FacultyAggregateSchema = z.object({ orderBy: z.union([FacultyOrderByWithRelationInputObjectSchema, FacultyOrderByWithRelationInputObjectSchema.array()]).optional(), where: FacultyWhereInputObjectSchema.optional(), cursor: FacultyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), FacultyCountAggregateInputObjectSchema ]).optional(), _min: FacultyMinAggregateInputObjectSchema.optional(), _max: FacultyMaxAggregateInputObjectSchema.optional(), _avg: FacultyAvgAggregateInputObjectSchema.optional(), _sum: FacultySumAggregateInputObjectSchema.optional() })