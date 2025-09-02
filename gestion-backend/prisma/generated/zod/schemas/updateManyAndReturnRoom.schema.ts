import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomUpdateManyMutationInputObjectSchema } from './objects/RoomUpdateManyMutationInput.schema';
import { RoomWhereInputObjectSchema } from './objects/RoomWhereInput.schema';

export const RoomUpdateManyAndReturnSchema = z.object({ select: RoomSelectObjectSchema.optional(), data: RoomUpdateManyMutationInputObjectSchema, where: RoomWhereInputObjectSchema.optional()  }).strict()