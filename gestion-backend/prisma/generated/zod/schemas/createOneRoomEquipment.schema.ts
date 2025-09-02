import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentIncludeObjectSchema } from './objects/RoomEquipmentInclude.schema';
import { RoomEquipmentCreateInputObjectSchema } from './objects/RoomEquipmentCreateInput.schema';
import { RoomEquipmentUncheckedCreateInputObjectSchema } from './objects/RoomEquipmentUncheckedCreateInput.schema';

export const RoomEquipmentCreateOneSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), include: RoomEquipmentIncludeObjectSchema.optional(), data: z.union([RoomEquipmentCreateInputObjectSchema, RoomEquipmentUncheckedCreateInputObjectSchema])  })