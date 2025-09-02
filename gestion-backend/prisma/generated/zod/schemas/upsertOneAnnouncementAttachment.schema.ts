import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentIncludeObjectSchema } from './objects/AnnouncementAttachmentInclude.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './objects/AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentCreateInputObjectSchema } from './objects/AnnouncementAttachmentCreateInput.schema';
import { AnnouncementAttachmentUncheckedCreateInputObjectSchema } from './objects/AnnouncementAttachmentUncheckedCreateInput.schema';
import { AnnouncementAttachmentUpdateInputObjectSchema } from './objects/AnnouncementAttachmentUpdateInput.schema';
import { AnnouncementAttachmentUncheckedUpdateInputObjectSchema } from './objects/AnnouncementAttachmentUncheckedUpdateInput.schema';

export const AnnouncementAttachmentUpsertSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), include: AnnouncementAttachmentIncludeObjectSchema.optional(), where: AnnouncementAttachmentWhereUniqueInputObjectSchema, create: z.union([ AnnouncementAttachmentCreateInputObjectSchema, AnnouncementAttachmentUncheckedCreateInputObjectSchema ]), update: z.union([ AnnouncementAttachmentUpdateInputObjectSchema, AnnouncementAttachmentUncheckedUpdateInputObjectSchema ])  })