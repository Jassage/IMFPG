import { z } from 'zod';
import { StudentWhereInputObjectSchema } from './objects/StudentWhereInput.schema';
import { StudentOrderByWithAggregationInputObjectSchema } from './objects/StudentOrderByWithAggregationInput.schema';
import { StudentScalarWhereWithAggregatesInputObjectSchema } from './objects/StudentScalarWhereWithAggregatesInput.schema';
import { StudentScalarFieldEnumSchema } from './enums/StudentScalarFieldEnum.schema';
import { StudentCountAggregateInputObjectSchema } from './objects/StudentCountAggregateInput.schema';
import { StudentMinAggregateInputObjectSchema } from './objects/StudentMinAggregateInput.schema';
import { StudentMaxAggregateInputObjectSchema } from './objects/StudentMaxAggregateInput.schema';

export const StudentGroupBySchema = z.object({ where: StudentWhereInputObjectSchema.optional(), orderBy: z.union([StudentOrderByWithAggregationInputObjectSchema, StudentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: StudentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(StudentScalarFieldEnumSchema), _count: z.union([ z.literal(true), StudentCountAggregateInputObjectSchema ]).optional(), _min: StudentMinAggregateInputObjectSchema.optional(), _max: StudentMaxAggregateInputObjectSchema.optional() })