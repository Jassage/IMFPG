import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentIncludeObjectSchema } from './objects/AnnouncementAttachmentInclude.schema';
import { AnnouncementAttachmentCreateInputObjectSchema } from './objects/AnnouncementAttachmentCreateInput.schema';
import { AnnouncementAttachmentUncheckedCreateInputObjectSchema } from './objects/AnnouncementAttachmentUncheckedCreateInput.schema';

export const AnnouncementAttachmentCreateOneSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), include: AnnouncementAttachmentIncludeObjectSchema.optional(), data: z.union([AnnouncementAttachmentCreateInputObjectSchema, AnnouncementAttachmentUncheckedCreateInputObjectSchema])  })