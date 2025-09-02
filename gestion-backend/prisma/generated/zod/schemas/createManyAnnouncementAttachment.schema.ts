import { z } from 'zod';
import { AnnouncementAttachmentCreateManyInputObjectSchema } from './objects/AnnouncementAttachmentCreateManyInput.schema';

export const AnnouncementAttachmentCreateManySchema = z.object({ data: z.union([ AnnouncementAttachmentCreateManyInputObjectSchema, z.array(AnnouncementAttachmentCreateManyInputObjectSchema) ]),  })