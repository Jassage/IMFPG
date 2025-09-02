import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentIncludeObjectSchema } from './objects/MessageAttachmentInclude.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';

export const MessageAttachmentFindUniqueOrThrowSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), include: MessageAttachmentIncludeObjectSchema.optional(), where: MessageAttachmentWhereUniqueInputObjectSchema })