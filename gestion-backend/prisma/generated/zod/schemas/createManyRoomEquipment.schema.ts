import { z } from 'zod';
import { RoomEquipmentCreateManyInputObjectSchema } from './objects/RoomEquipmentCreateManyInput.schema';

export const RoomEquipmentCreateManySchema = z.object({ data: z.union([ RoomEquipmentCreateManyInputObjectSchema, z.array(RoomEquipmentCreateManyInputObjectSchema) ]),  })