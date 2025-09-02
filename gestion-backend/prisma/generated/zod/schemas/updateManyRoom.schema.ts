import { z } from 'zod';
import { RoomUpdateManyMutationInputObjectSchema } from './objects/RoomUpdateManyMutationInput.schema';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomUpdateManySchema = z.object({ data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional()  })