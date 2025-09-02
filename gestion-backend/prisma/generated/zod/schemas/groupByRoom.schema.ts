import { z } from 'zod';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';
import { RoomOrderByWithAggregationInputObjectSchema } from './objects/RoomOrderByWithAggregationInput.schema';
import { RoomScalarWhereWithAggregatesInputObjectSchema } from './objects/RoomScalarWhereWithAggregatesInput.schema';
import { RoomScalarFieldEnumSchema } from './enums/RoomScalarFieldEnum.schema';
import { RoomCountAggregateInputObjectSchema } from './objects/RoomCountAggregateInput.schema';
import { RoomMinAggregateInputObjectSchema } from './objects/RoomMinAggregateInput.schema';
import { RoomMaxAggregateInputObjectSchema } from './objects/RoomMaxAggregateInput.schema';

export const RoomGroupBySchema = z.object({ where: RoomWhereInputObjectSchema.optional(), orderBy: z.union([RoomOrderByWithAggregationInputObjectSchema, RoomOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RoomScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RoomScalarFieldEnumSchema), _count: z.union([ z.literal(true), RoomCountAggregateInputObjectSchema ]).optional(), _min: RoomMinAggregateInputObjectSchema.optional(), _max: RoomMaxAggregateInputObjectSchema.optional() })