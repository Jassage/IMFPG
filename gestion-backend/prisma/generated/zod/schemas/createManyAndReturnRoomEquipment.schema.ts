import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentCreateManyInputObjectSchema } from './objects/RoomEquipmentCreateManyInput.schema';

export const RoomEquipmentCreateManyAndReturnSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), data: z.union([ RoomEquipmentCreateManyInputObjectSchema, z.array(RoomEquipmentCreateManyInputObjectSchema) ]),  }).strict()