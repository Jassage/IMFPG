import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentIncludeObjectSchema } from './objects/AnnouncementAttachmentInclude.schema';
import { AnnouncementAttachmentUpdateInputObjectSchema } from './objects/AnnouncementAttachmentUpdateInput.schema';
import { AnnouncementAttachmentUncheckedUpdateInputObjectSchema } from './objects/AnnouncementAttachmentUncheckedUpdateInput.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';

export const AnnouncementAttachmentUpdateOneSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), include: AnnouncementAttachmentIncludeObjectSchema.optional(), data: z.union([AnnouncementAttachmentUpdateInputObjectSchema, AnnouncementAttachmentUncheckedUpdateInputObjectSchema]), where: AnnouncementAttachmentWhereUniqueInputObjectSchema  })