import { z } from 'zod';
import { RoomReservationOrderByWithRelationInputObjectSchema } from './objects/RoomReservationOrderByWithRelationInput.schema';
import { RoomReservationWhereInputObjectSchema } from './objects/RoomReservationWhereInput.schema';
import { RoomReservationWhereUniqueInputObjectSchema } from './objects/RoomReservationWhereUniqueInput.schema';
import { RoomReservationCountAggregateInputObjectSchema } from './objects/RoomReservationCountAggregateInput.schema';
import { RoomReservationMinAggregateInputObjectSchema } from './objects/RoomReservationMinAggregateInput.schema';
import { RoomReservationMaxAggregateInputObjectSchema } from './objects/RoomReservationMaxAggregateInput.schema';

export const RoomReservationAggregateSchema = z.object({ orderBy: z.union([RoomReservationOrderByWithRelationInputObjectSchema, RoomReservationOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomReservationWhereInputObjectSchema.optional(), cursor: RoomReservationWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoomReservationCountAggregateInputObjectSchema ]).optional(), _min: RoomReservationMinAggregateInputObjectSchema.optional(), _max: RoomReservationMaxAggregateInputObjectSchema.optional() })