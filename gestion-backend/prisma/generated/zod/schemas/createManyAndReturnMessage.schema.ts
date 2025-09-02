import { z } from 'zod';
import { MessageSelectObjectSchema } from './objects/MessageSelect.schema';
import { MessageCreateManyInputObjectSchema } from './objects/MessageCreateManyInput.schema';

export const MessageCreateManyAndReturnSchema = z.object({ select: MessageSelectObjectSchema.optional(), data: z.union([ MessageCreateManyInputObjectSchema, z.array(MessageCreateManyInputObjectSchema) ]),  }).strict()