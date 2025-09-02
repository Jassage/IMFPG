import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentIncludeObjectSchema } from './objects/RoomEquipmentInclude.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';

export const RoomEquipmentDeleteOneSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), include: RoomEquipmentIncludeObjectSchema.optional(), where: RoomEquipmentWhereUniqueInputObjectSchema  })