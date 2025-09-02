import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentIncludeObjectSchema } from './objects/MessageAttachmentInclude.schema';
import { MessageAttachmentUpdateInputObjectSchema } from './objects/MessageAttachmentUpdateInput.schema';
import { MessageAttachmentUncheckedUpdateInputObjectSchema } from './objects/MessageAttachmentUncheckedUpdateInput.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';

export const MessageAttachmentUpdateOneSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), include: MessageAttachmentIncludeObjectSchema.optional(), data: z.union([MessageAttachmentUpdateInputObjectSchema, MessageAttachmentUncheckedUpdateInputObjectSchema]), where: MessageAttachmentWhereUniqueInputObjectSchema  })