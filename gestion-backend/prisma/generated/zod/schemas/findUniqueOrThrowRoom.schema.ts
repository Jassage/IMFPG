import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomIncludeObjectSchema } from './objects/RoomInclude.schema';
import { RoomWhereUniqueInputObjectSchema } from './objects/RoomWhereUniqueInput.schema';

export const RoomFindUniqueOrThrowSchema = z.object({ select: RoomSelectObjectSchema.optional(), include: RoomIncludeObjectSchema.optional(), where: RoomWhereUniqueInputObjectSchema })