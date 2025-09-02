import { z } from 'zod';
import { GuardianOrderByWithRelationInputObjectSchema } from './objects/GuardianOrderByWithRelationInput.schema';
import { GuardianWhereInputObjectSchema } from './objects/GuardianWhereInput.schema';
import { GuardianWhereUniqueInputObjectSchema } from './objects/GuardianWhereUniqueInput.schema';
import { GuardianCountAggregateInputObjectSchema } from './objects/GuardianCountAggregateInput.schema';
import { GuardianMinAggregateInputObjectSchema } from './objects/GuardianMinAggregateInput.schema';
import { GuardianMaxAggregateInputObjectSchema } from './objects/GuardianMaxAggregateInput.schema';

export const GuardianAggregateSchema = z.object({ orderBy: z.union([GuardianOrderByWithRelationInputObjectSchema, GuardianOrderByWithRelationInputObjectSchema.array()]).optional(), where: GuardianWhereInputObjectSchema.optional(), cursor: GuardianWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), GuardianCountAggregateInputObjectSchema ]).optional(), _min: GuardianMinAggregateInputObjectSchema.optional(), _max: GuardianMaxAggregateInputObjectSchema.optional() })