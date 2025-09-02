import { z } from 'zod';
import { RoomEquipmentSelectObjectSchema } from './objects/RoomEquipmentSelect.schema';
import { RoomEquipmentIncludeObjectSchema } from './objects/RoomEquipmentInclude.schema';
import { RoomEquipmentWhereUniqueInputObjectSchema } from './objects/RoomEquipmentWhereUniqueInput.schema';
import { RoomEquipmentCreateInputObjectSchema } from './objects/RoomEquipmentCreateInput.schema';
import { RoomEquipmentUncheckedCreateInputObjectSchema } from './objects/RoomEquipmentUncheckedCreateInput.schema';
import { RoomEquipmentUpdateInputObjectSchema } from './objects/RoomEquipmentUpdateInput.schema';
import { RoomEquipmentUncheckedUpdateInputObjectSchema } from './objects/RoomEquipmentUncheckedUpdateInput.schema';

export const RoomEquipmentUpsertSchema = z.object({ select: RoomEquipmentSelectObjectSchema.optional(), include: RoomEquipmentIncludeObjectSchema.optional(), where: RoomEquipmentWhereUniqueInputObjectSchema, create: z.union([ RoomEquipmentCreateInputObjectSchema, RoomEquipmentUncheckedCreateInputObjectSchema ]), update: z.union([ RoomEquipmentUpdateInputObjectSchema, RoomEquipmentUncheckedUpdateInputObjectSchema ])  })