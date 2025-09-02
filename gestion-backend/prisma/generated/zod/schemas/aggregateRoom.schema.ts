import { z } from 'zod';
import { RoomOrderByWithRelationInputObjectSchema } from './objects/RoomOrderByWithRelationInput.schema';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';
import { RoomMinAggregateInputObjectSchema } from './objects/RoomMinAggregateInput.schema';
import { RoomMaxAggregateInputObjectSchema } from './objects/RoomMaxAggregateInput.schema';
import { RoomAvgAggregateInputObjectSchema } from './objects/RoomAvgAggregateInput.schema';
import { RoomSumAggregateInputObjectSchema } from './objects/RoomSumAggregateInput.schema';

export const RoomAggregateSchema = z.object({ orderBy: z.union([RoomOrderByWithRelationInputObjectSchema, RoomOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomWhereInputObjectSchema.optional(), cursor: RoomWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional(), _avg: RoomAvgAggregateInputObjectSchema.optional(), _sum: RoomSumAggregateInputObjectSchema.optional() })