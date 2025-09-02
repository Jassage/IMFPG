import { z } from 'zod';
import { EventSelectObjectSchema } from './objects/EventSelect.schema';
import { EventCreateManyInputObjectSchema } from './objects/EventCreateManyInput.schema';

export const EventCreateManyAndReturnSchema = z.object({ select: EventSelectObjectSchema.optional(), data: z.union([ EventCreateManyInputObjectSchema, z.array(EventCreateManyInputObjectSchema) ]),  }).strict()