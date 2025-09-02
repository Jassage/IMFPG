import { z } from 'zod';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';
import { UEPrerequisiteOrderByWithAggregationInputObjectSchema } from './objects/UEPrerequisiteOrderByWithAggregationInput.schema';
import { UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema } from './objects/UEPrerequisiteScalarWhereWithAggregatesInput.schema';
import { UEPrerequisiteScalarFieldEnumSchema } from './enums/UEPrerequisiteScalarFieldEnum.schema';
import { UEPrerequisiteCountAggregateInputObjectSchema } from './objects/UEPrerequisiteCountAggregateInput.schema';
import { UEPrerequisiteMinAggregateInputObjectSchema } from './objects/UEPrerequisiteMinAggregateInput.schema';
import { UEPrerequisiteMaxAggregateInputObjectSchema } from './objects/UEPrerequisiteMaxAggregateInput.schema';

export const UEPrerequisiteGroupBySchema = z.object({ where: UEPrerequisiteWhereInputObjectSchema.optional(), orderBy: z.union([UEPrerequisiteOrderByWithAggregationInputObjectSchema, UEPrerequisiteOrderByWithAggregationInputObjectSchema.array()]).optional(), having: UEPrerequisiteScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(UEPrerequisiteScalarFieldEnumSchema), _count: z.union([ z.literal(true), UEPrerequisiteCountAggregateInputObjectSchema ]).optional(), _min: UEPrerequisiteMinAggregateInputObjectSchema.optional(), _max: UEPrerequisiteMaxAggregateInputObjectSchema.optional() })