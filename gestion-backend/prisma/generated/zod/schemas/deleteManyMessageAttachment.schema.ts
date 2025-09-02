import { z } from 'zod';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';

export const MessageAttachmentDeleteManySchema = z.object({ where: MessageAttachmentWhereInputObjectSchema.optional()  })