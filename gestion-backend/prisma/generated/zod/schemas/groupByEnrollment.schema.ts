import { z } from 'zod';
import { EnrollmentWhereInputObjectSchema } from './objects/EnrollmentWhereInput.schema';
import { EnrollmentOrderByWithAggregationInputObjectSchema } from './objects/EnrollmentOrderByWithAggregationInput.schema';
import { EnrollmentScalarWhereWithAggregatesInputObjectSchema } from './objects/EnrollmentScalarWhereWithAggregatesInput.schema';
import { EnrollmentScalarFieldEnumSchema } from './enums/EnrollmentScalarFieldEnum.schema';
import { EnrollmentCountAggregateInputObjectSchema } from './objects/EnrollmentCountAggregateInput.schema';
import { EnrollmentMinAggregateInputObjectSchema } from './objects/EnrollmentMinAggregateInput.schema';
import { EnrollmentMaxAggregateInputObjectSchema } from './objects/EnrollmentMaxAggregateInput.schema';

export const EnrollmentGroupBySchema = z.object({ where: EnrollmentWhereInputObjectSchema.optional(), orderBy: z.union([EnrollmentOrderByWithAggregationInputObjectSchema, EnrollmentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: EnrollmentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(EnrollmentScalarFieldEnumSchema), _count: z.union([ z.literal(true), EnrollmentCountAggregateInputObjectSchema ]).optional(), _min: EnrollmentMinAggregateInputObjectSchema.optional(), _max: EnrollmentMaxAggregateInputObjectSchema.optional() })