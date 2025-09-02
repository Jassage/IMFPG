import { z } from 'zod';
import { MessageAttachmentSelectObjectSchema } from './objects/MessageAttachmentSelect.schema';
import { MessageAttachmentCreateManyInputObjectSchema } from './objects/MessageAttachmentCreateManyInput.schema';

export const MessageAttachmentCreateManyAndReturnSchema = z.object({ select: MessageAttachmentSelectObjectSchema.optional(), data: z.union([ MessageAttachmentCreateManyInputObjectSchema, z.array(MessageAttachmentCreateManyInputObjectSchema) ]),  }).strict()