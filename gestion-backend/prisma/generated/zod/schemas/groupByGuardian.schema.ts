import { z } from 'zod';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';
import { GuardianOrderByWithAggregationInputObjectSchema } from './objects/GuardianOrderByWithAggregationInput.schema';
import { GuardianScalarWhereWithAggregatesInputObjectSchema } from './objects/GuardianScalarWhereWithAggregatesInput.schema';
import { GuardianScalarFieldEnumSchema } from './enums/GuardianScalarFieldEnum.schema';
import { GuardianCountAggregateInputObjectSchema } from './objects/GuardianCountAggregateInput.schema';
import { GuardianMinAggregateInputObjectSchema } from './objects/GuardianMinAggregateInput.schema';
import { GuardianMaxAggregateInputObjectSchema } from './objects/GuardianMaxAggregateInput.schema';

export const GuardianGroupBySchema = z.object({ where: GuardianWhereInputObjectSchema.optional(), orderBy: z.union([GuardianOrderByWithAggregationInputObjectSchema, GuardianOrderByWithAggregationInputObjectSchema.array()]).optional(), having: GuardianScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(GuardianScalarFieldEnumSchema), _count: z.union([ z.literal(true), GuardianCountAggregateInputObjectSchema ]).optional(), _min: GuardianMinAggregateInputObjectSchema.optional(), _max: GuardianMaxAggregateInputObjectSchema.optional() })