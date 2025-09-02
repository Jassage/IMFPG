import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentUpdateManyMutationInputObjectSchema } from './objects/MessageAttachmentUpdateManyMutationInput.schema';
import { MessageAttachmentWhereInputObjectSchema } from './objects/MessageAttachmentWhereInput.schema';

export const MessageAttachmentUpdateManyAndReturnSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), data: MessageAttachmentUpdateManyMutationInputObjectSchema, where: MessageAttachmentWhereInputObjectSchema.optional()  }).strict()