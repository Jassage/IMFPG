import { z } from 'zod';
import { UEPrerequisiteOrderByWithRelationInputObjectSchema } from './objects/UEPrerequisiteOrderByWithRelationInput.schema';
import { UEPrerequisiteWhereInputObjectSchema } from './objects/UEPrerequisiteWhereInput.schema';
import { UEPrerequisiteWhereUniqueInputObjectSchema } from './objects/UEPrerequisiteWhereUniqueInput.schema';
import { UEPrerequisiteCountAggregateInputObjectSchema } from './objects/UEPrerequisiteCountAggregateInput.schema';
import { UEPrerequisiteMinAggregateInputObjectSchema } from './objects/UEPrerequisiteMinAggregateInput.schema';
import { UEPrerequisiteMaxAggregateInputObjectSchema } from './objects/UEPrerequisiteMaxAggregateInput.schema';

export const UEPrerequisiteAggregateSchema = z.object({ orderBy: z.union([UEPrerequisiteOrderByWithRelationInputObjectSchema, UEPrerequisiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: UEPrerequisiteWhereInputObjectSchema.optional(), cursor: UEPrerequisiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), UEPrerequisiteCountAggregateInputObjectSchema ]).optional(), _min: UEPrerequisiteMinAggregateInputObjectSchema.optional(), _max: UEPrerequisiteMaxAggregateInputObjectSchema.optional() })