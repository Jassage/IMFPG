import { z } from 'zod';
import { RoomCreateManyInputObjectSchema } from './objects/RoomCreateManyInput.schema';

export const RoomCreateManySchema = z.object({ data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]),  })