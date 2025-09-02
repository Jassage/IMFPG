import { z } from 'zod';
import { UECreateManyInputObjectSchema } from './objects/UECreateManyInput.schema';

export const UECreateManySchema = z.object({ data: z.union([ UECreateManyInputObjectSchema, z.array(UECreateManyInputObjectSchema) ]),  })