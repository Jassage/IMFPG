import { z } from 'zod';
import { MessageSelectObjectSchema } from './objects/MessageSelect.schema';
import { MessageUpdateManyMutationInputObjectSchema } from './objects/MessageUpdateManyMutationInput.schema';
import { MessageWhereInputObjectSchema } from './objects/MessageWhereInput.schema';

export const MessageUpdateManyAndReturnSchema = z.object({ select: MessageSelectObjectSchema.optional(), data: MessageUpdateManyMutationInputObjectSchema, where: MessageWhereInputObjectSchema.optional()  }).strict()