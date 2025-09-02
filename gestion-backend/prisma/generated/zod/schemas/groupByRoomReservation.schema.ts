import { z } from 'zod';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';
import { RoomReservationOrderByWithAggregationInputObjectSchema } from './objects/RoomReservationOrderByWithAggregationInput.schema';
import { RoomReservationScalarWhereWithAggregatesInputObjectSchema } from './objects/RoomReservationScalarWhereWithAggregatesInput.schema';
import { RoomReservationScalarFieldEnumSchema } from './enums/RoomReservationScalarFieldEnum.schema';
import { RoomReservationCountAggregateInputObjectSchema } from './objects/RoomReservationCountAggregateInput.schema';
import { RoomReservationMinAggregateInputObjectSchema } from './objects/RoomReservationMinAggregateInput.schema';
import { RoomReservationMaxAggregateInputObjectSchema } from './objects/RoomReservationMaxAggregateInput.schema';

export const RoomReservationGroupBySchema = z.object({ where: RoomReservationWhereInputObjectSchema.optional(), orderBy: z.union([RoomReservationOrderByWithAggregationInputObjectSchema, RoomReservationOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RoomReservationScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RoomReservationScalarFieldEnumSchema), _count: z.union([ z.literal(true), RoomReservationCountAggregateInputObjectSchema ]).optional(), _min: RoomReservationMinAggregateInputObjectSchema.optional(), _max: RoomReservationMaxAggregateInputObjectSchema.optional() })