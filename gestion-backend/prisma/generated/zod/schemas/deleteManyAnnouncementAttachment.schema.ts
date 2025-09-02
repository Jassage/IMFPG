import { z } from 'zod';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';

export const AnnouncementAttachmentDeleteManySchema = z.object({ where: AnnouncementAttachmentWhereInputObjectSchema.optional()  })