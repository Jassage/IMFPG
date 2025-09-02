import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementIncludeObjectSchema } from './objects/AnnouncementInclude.schema';
import { AnnouncementUpdateInputObjectSchema } from './objects/AnnouncementUpdateInput.schema';
import { AnnouncementUncheckedUpdateInputObjectSchema } from './objects/AnnouncementUncheckedUpdateInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';

export const AnnouncementUpdateOneSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), include: AnnouncementIncludeObjectSchema.optional(), data: z.union([AnnouncementUpdateInputObjectSchema, AnnouncementUncheckedUpdateInputObjectSchema]), where: AnnouncementWhereUniqueInputObjectSchema  })