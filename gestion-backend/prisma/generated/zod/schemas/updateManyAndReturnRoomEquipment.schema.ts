import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentUpdateManyMutationInputObjectSchema } from './objects/RoomEquipmentUpdateManyMutationInput.schema';
import { RoomEquipmentWhereInputObjectSchema } from './objects/RoomEquipmentWhereInput.schema';

export const RoomEquipmentUpdateManyAndReturnSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), data: RoomEquipmentUpdateManyMutationInputObjectSchema, where: RoomEquipmentWhereInputObjectSchema.optional()  }).strict()