import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentIncludeObjectSchema } from './objects/MessageAttachmentInclude.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './objects/MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentCreateInputObjectSchema } from './objects/MessageAttachmentCreateInput.schema';
import { MessageAttachmentUncheckedCreateInputObjectSchema } from './objects/MessageAttachmentUncheckedCreateInput.schema';
import { MessageAttachmentUpdateInputObjectSchema } from './objects/MessageAttachmentUpdateInput.schema';
import { MessageAttachmentUncheckedUpdateInputObjectSchema } from './objects/MessageAttachmentUncheckedUpdateInput.schema';

export const MessageAttachmentUpsertSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), include: MessageAttachmentIncludeObjectSchema.optional(), where: MessageAttachmentWhereUniqueInputObjectSchema, create: z.union([ MessageAttachmentCreateInputObjectSchema, MessageAttachmentUncheckedCreateInputObjectSchema ]), update: z.union([ MessageAttachmentUpdateInputObjectSchema, MessageAttachmentUncheckedUpdateInputObjectSchema ])  })