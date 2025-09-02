import { z } from 'zod';
import { UESelectObjectSchema } from './objects/UESelect.schema';
import { UECreateManyInputObjectSchema } from './objects/UECreateManyInput.schema';

export const UECreateManyAndReturnSchema = z.object({ select: UESelectObjectSchema.optional(), data: z.union([ UECreateManyInputObjectSchema, z.array(UECreateManyInputObjectSchema) ]),  }).strict()