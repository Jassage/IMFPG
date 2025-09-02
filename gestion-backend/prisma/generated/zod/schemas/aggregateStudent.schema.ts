import { z } from 'zod';
import { StudentOrderByWithRelationInputObjectSchema } from './objects/StudentOrderByWithRelationInput.schema';
import { StudentWhereInputObjectSchema } from './objects/StudentWhereInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './objects/StudentWhereUniqueInput.schema';
import { StudentCountAggregateInputObjectSchema } from './objects/StudentCountAggregateInput.schema';
import { StudentMinAggregateInputObjectSchema } from './objects/StudentMinAggregateInput.schema';
import { StudentMaxAggregateInputObjectSchema } from './objects/StudentMaxAggregateInput.schema';

export const StudentAggregateSchema = z.object({ orderBy: z.union([StudentOrderByWithRelationInputObjectSchema, StudentOrderByWithRelationInputObjectSchema.array()]).optional(), where: StudentWhereInputObjectSchema.optional(), cursor: StudentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), StudentCountAggregateInputObjectSchema ]).optional(), _min: StudentMinAggregateInputObjectSchema.optional(), _max: StudentMaxAggregateInputObjectSchema.optional() })