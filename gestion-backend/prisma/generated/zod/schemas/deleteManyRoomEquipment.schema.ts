import { z } from 'zod';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';

export const RoomEquipmentDeleteManySchema = z.object({ where: RoomEquipmentWhereInputObjectSchema.optional()  })