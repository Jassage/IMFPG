import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomIncludeObjectSchema } from './objects/RoomInclude.schema';
import { RoomUpdateInputObjectSchema } from './objects/RoomUpdateInput.schema';
import { RoomUncheckedUpdateInputObjectSchema } from './objects/RoomUncheckedUpdateInput.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';

export const RoomUpdateOneSchema = z.object({ select: RoomSelectObjectSchema.optional(), include: RoomIncludeObjectSchema.optional(), data: z.union([RoomUpdateInputObjectSchema, RoomUncheckedUpdateInputObjectSchema]), where: RoomWhereUniqueInputObjectSchema  })