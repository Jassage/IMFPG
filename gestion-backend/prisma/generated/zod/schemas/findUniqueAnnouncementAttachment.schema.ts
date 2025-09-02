import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentIncludeObjectSchema } from './objects/AnnouncementAttachmentInclude.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';

export const AnnouncementAttachmentFindUniqueSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), include: AnnouncementAttachmentIncludeObjectSchema.optional(), where: AnnouncementAttachmentWhereUniqueInputObjectSchema })