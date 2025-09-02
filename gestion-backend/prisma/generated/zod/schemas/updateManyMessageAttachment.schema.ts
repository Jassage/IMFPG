import { z } from 'zod';
import { MessageAttachmentUpdateManyMutationInputObjectSchema } from './objects/MessageAttachmentUpdateManyMutationInput.schema';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';

export const MessageAttachmentUpdateManySchema = z.object({ data: MessageAttachmentUpdateManyMutationInputObjectSchema, where: MessageAttachmentWhereInputObjectSchema.optional()  })