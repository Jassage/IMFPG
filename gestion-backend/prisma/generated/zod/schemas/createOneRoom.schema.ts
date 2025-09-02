import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomIncludeObjectSchema } from './objects/RoomInclude.schema';
import { RoomCreateInputObjectSchema } from './objects/RoomCreateInput.schema';
import { RoomUncheckedCreateInputObjectSchema } from './objects/RoomUncheckedCreateInput.schema';

export const RoomCreateOneSchema = z.object({ select: RoomSelectObjectSchema.optional(), include: RoomIncludeObjectSchema.optional(), data: z.union([RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema])  })