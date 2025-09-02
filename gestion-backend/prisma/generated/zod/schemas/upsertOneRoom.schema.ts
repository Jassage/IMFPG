import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomIncludeObjectSchema } from './objects/RoomInclude.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';
import { RoomCreateInputObjectSchema } from './objects/RoomCreateInput.schema';
import { RoomUncheckedCreateInputObjectSchema } from './objects/RoomUncheckedCreateInput.schema';
import { RoomUpdateInputObjectSchema } from './objects/RoomUpdateInput.schema';
import { RoomUncheckedUpdateInputObjectSchema } from './objects/RoomUncheckedUpdateInput.schema';

export const RoomUpsertSchema = z.object({ select: RoomSelectObjectSchema.optional(), include: RoomIncludeObjectSchema.optional(), where: RoomWhereUniqueInputObjectSchema, create: z.union([ RoomCreateInputObjectSchema, RoomUncheckedCreateInputObjectSchema ]), update: z.union([ RoomUpdateInputObjectSchema, RoomUncheckedUpdateInputObjectSchema ])  })