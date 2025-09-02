import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentUpdateManyMutationInputObjectSchema } from './objects/AnnouncementAttachmentUpdateManyMutationInput.schema';
import { AnnouncementAttachmentWhereInputObjectSchema } from './objects/AnnouncementAttachmentWhereInput.schema';

export const AnnouncementAttachmentUpdateManyAndReturnSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), data: AnnouncementAttachmentUpdateManyMutationInputObjectSchema, where: AnnouncementAttachmentWhereInputObjectSchema.optional()  }).strict()