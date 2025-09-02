import { z } from 'zod';
import { UEWhereInputObjectSchema } from './objects/UEWhereInput.schema';
import { UEOrderByWithAggregationInputObjectSchema } from './objects/UEOrderByWithAggregationInput.schema';
import { UEScalarWhereWithAggregatesInputObjectSchema } from './objects/UEScalarWhereWithAggregatesInput.schema';
import { UEScalarFieldEnumSchema } from './enums/UEScalarFieldEnum.schema';
import { UECountAggregateInputObjectSchema } from './objects/UECountAggregateInput.schema';
import { UEMinAggregateInputObjectSchema } from './objects/UEMinAggregateInput.schema';
import { UEMaxAggregateInputObjectSchema } from './objects/UEMaxAggregateInput.schema';

export const UEGroupBySchema = z.object({ where: UEWhereInputObjectSchema.optional(), orderBy: z.union([UEOrderByWithAggregationInputObjectSchema, UEOrderByWithAggregationInputObjectSchema.array()]).optional(), having: UEScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(UEScalarFieldEnumSchema), _count: z.union([ z.literal(true), UECountAggregateInputObjectSchema ]).optional(), _min: UEMinAggregateInputObjectSchema.optional(), _max: UEMaxAggregateInputObjectSchema.optional() })