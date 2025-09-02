import { z } from 'zod';
import { AnnouncementAttachmentUpdateManyMutationInputObjectSchema } from './objects/AnnouncementAttachmentUpdateManyMutationInput.schema';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';

export const AnnouncementAttachmentUpdateManySchema = z.object({ data: AnnouncementAttachmentUpdateManyMutationInputObjectSchema, where: AnnouncementAttachmentWhereInputObjectSchema.optional()  })