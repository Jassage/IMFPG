import { z } from 'zod';
import { RoomEquipmentUpdateManyMutationInputObjectSchema } from './objects/RoomEquipmentUpdateManyMutationInput.schema';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';

export const RoomEquipmentUpdateManySchema = z.object({ data: RoomEquipmentUpdateManyMutationInputObjectSchema, where: RoomEquipmentWhereInputObjectSchema.optional()  })