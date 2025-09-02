import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementIncludeObjectSchema } from './objects/AnnouncementInclude.schema';
import { AnnouncementCreateInputObjectSchema } from './objects/AnnouncementCreateInput.schema';
import { AnnouncementUncheckedCreateInputObjectSchema } from './objects/AnnouncementUncheckedCreateInput.schema';

export const AnnouncementCreateOneSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), include: AnnouncementIncludeObjectSchema.optional(), data: z.union([AnnouncementCreateInputObjectSchema, AnnouncementUncheckedCreateInputObjectSchema])  })