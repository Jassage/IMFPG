import { z } from 'zod';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';
import { RoomEquipmentOrderByWithAggregationInputObjectSchema } from './objects/RoomEquipmentOrderByWithAggregationInput.schema';
import { RoomEquipmentScalarWhereWithAggregatesInputObjectSchema } from './objects/RoomEquipmentScalarWhereWithAggregatesInput.schema';
import { RoomEquipmentScalarFieldEnumSchema } from './enums/RoomEquipmentScalarFieldEnum.schema';
import { RoomEquipmentCountAggregateInputObjectSchema } from './objects/RoomEquipmentCountAggregateInput.schema';
import { RoomEquipmentMinAggregateInputObjectSchema } from './objects/RoomEquipmentMinAggregateInput.schema';
import { RoomEquipmentMaxAggregateInputObjectSchema } from './objects/RoomEquipmentMaxAggregateInput.schema';

export const RoomEquipmentGroupBySchema = z.object({ where: RoomEquipmentWhereInputObjectSchema.optional(), orderBy: z.union([RoomEquipmentOrderByWithAggregationInputObjectSchema, RoomEquipmentOrderByWithAggregationInputObjectSchema.array()]).optional(), having: RoomEquipmentScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(RoomEquipmentScalarFieldEnumSchema), _count: z.union([ z.literal(true), RoomEquipmentCountAggregateInputObjectSchema ]).optional(), _min: RoomEquipmentMinAggregateInputObjectSchema.optional(), _max: RoomEquipmentMaxAggregateInputObjectSchema.optional() })