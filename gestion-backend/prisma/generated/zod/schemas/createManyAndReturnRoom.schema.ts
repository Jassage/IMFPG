import { z } from 'zod';
import { RoomSelectObjectSchema } from './objects/RoomSelect.schema';
import { RoomCreateManyInputObjectSchema } from './objects/RoomCreateManyInput.schema';

export const RoomCreateManyAndReturnSchema = z.object({ select: RoomSelectObjectSchema.optional(), data: z.union([ RoomCreateManyInputObjectSchema, z.array(RoomCreateManyInputObjectSchema) ]),  }).strict()