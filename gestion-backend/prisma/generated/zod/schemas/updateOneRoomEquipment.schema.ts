import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentIncludeObjectSchema } from './objects/RoomEquipmentInclude.schema';
import { RoomEquipmentUpdateInputObjectSchema } from './objects/RoomEquipmentUpdateInput.schema';
import { RoomEquipmentUncheckedUpdateInputObjectSchema } from './objects/RoomEquipmentUncheckedUpdateInput.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';

export const RoomEquipmentUpdateOneSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), include: RoomEquipmentIncludeObjectSchema.optional(), data: z.union([RoomEquipmentUpdateInputObjectSchema, RoomEquipmentUncheckedUpdateInputObjectSchema]), where: RoomEquipmentWhereUniqueInputObjectSchema  })