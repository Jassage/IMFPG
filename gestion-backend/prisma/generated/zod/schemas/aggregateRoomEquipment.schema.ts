import { z } from 'zod';
import { RoomEquipmentOrderByWithRelationInputObjectSchema } from './objects/RoomEquipmentOrderByWithRelationInput.schema';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentCountAggregateInputObjectSchema } from './objects/RoomEquipmentCountAggregateInput.schema';
import { RoomEquipmentMinAggregateInputObjectSchema } from './objects/RoomEquipmentMinAggregateInput.schema';
import { RoomEquipmentMaxAggregateInputObjectSchema } from './objects/RoomEquipmentMaxAggregateInput.schema';

export const RoomEquipmentAggregateSchema = z.object({ orderBy: z.union([RoomEquipmentOrderByWithRelationInputObjectSchema, RoomEquipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: RoomEquipmentWhereInputObjectSchema.optional(), cursor: RoomEquipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), RoomEquipmentCountAggregateInputObjectSchema ]).optional(), _min: RoomEquipmentMinAggregateInputObjectSchema.optional(), _max: RoomEquipmentMaxAggregateInputObjectSchema.optional() })