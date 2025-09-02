import { z } from 'zod';
import { AnnouncementAttachmentSelectObjectSchema } from './objects/AnnouncementAttachmentSelect.schema';
import { AnnouncementAttachmentCreateManyInputObjectSchema } from './objects/AnnouncementAttachmentCreateManyInput.schema';

export const AnnouncementAttachmentCreateManyAndReturnSchema = z.object({ select: AnnouncementAttachmentSelectObjectSchema.optional(), data: z.union([ AnnouncementAttachmentCreateManyInputObjectSchema, z.array(AnnouncementAttachmentCreateManyInputObjectSchema) ]),  }).strict()