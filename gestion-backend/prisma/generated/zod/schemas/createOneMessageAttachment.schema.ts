import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentIncludeObjectSchema } from './objects/MessageAttachmentInclude.schema';
import { MessageAttachmentCreateInputObjectSchema } from './objects/MessageAttachmentCreateInput.schema';
import { MessageAttachmentUncheckedCreateInputObjectSchema } from './objects/MessageAttachmentUncheckedCreateInput.schema';

export const MessageAttachmentCreateOneSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), include: MessageAttachmentIncludeObjectSchema.optional(), data: z.union([MessageAttachmentCreateInputObjectSchema, MessageAttachmentUncheckedCreateInputObjectSchema])  })