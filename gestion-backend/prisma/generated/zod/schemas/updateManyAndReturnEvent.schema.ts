import { z } from 'zod';
import { EventSelectObjectSchema } from './objects/EventSelect.schema';
import { EventUpdateManyMutationInputObjectSchema } from './objects/EventUpdateManyMutationInput.schema';
import { EventWhereInputObjectSchema } from './objects/EventWhereInput.schema';

export const EventUpdateManyAndReturnSchema = z.object({ select: EventSelectObjectSchema.optional(), data: EventUpdateManyMutationInputObjectSchema, where: EventWhereInputObjectSchema.optional()  }).strict()