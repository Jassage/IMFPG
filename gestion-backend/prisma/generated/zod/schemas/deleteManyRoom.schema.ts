import { z } from 'zod';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomDeleteManySchema = z.object({ where: RoomWhereInputObjectSchema.optional()  })