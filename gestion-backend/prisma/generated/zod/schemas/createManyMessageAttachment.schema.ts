import { z } from 'zod';
import { MessageAttachmentCreateManyInputObjectSchema } from './objects/MessageAttachmentCreateManyInput.schema';

export const MessageAttachmentCreateManySchema = z.object({ data: z.union([ MessageAttachmentCreateManyInputObjectSchema, z.array(MessageAttachmentCreateManyInputObjectSchema) ]),  })