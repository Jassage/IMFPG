import { z } from 'zod';
import { EnrollmentOrderByWithRelationInputObjectSchema } from './objects/EnrollmentOrderByWithRelationInput.schema';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';
import { EnrollmentWhereUniqueInputObjectSchema } from './objects/EnrollmentWhereUniqueInput.schema';
import { EnrollmentCountAggregateInputObjectSchema } from './objects/EnrollmentCountAggregateInput.schema';
import { EnrollmentMinAggregateInputObjectSchema } from './objects/EnrollmentMinAggregateInput.schema';
import { EnrollmentMaxAggregateInputObjectSchema } from './objects/EnrollmentMaxAggregateInput.schema';

export const EnrollmentAggregateSchema = z.object({ orderBy: z.union([EnrollmentOrderByWithRelationInputObjectSchema, EnrollmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: EnrollmentWhereInputObjectSchema.optional(), cursor: EnrollmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), EnrollmentCountAggregateInputObjectSchema ]).optional(), _min: EnrollmentMinAggregateInputObjectSchema.optional(), _max: EnrollmentMaxAggregateInputObjectSchema.optional() })