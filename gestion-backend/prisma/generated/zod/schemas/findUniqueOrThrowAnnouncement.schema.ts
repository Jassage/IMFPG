import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementIncludeObjectSchema } from './objects/AnnouncementInclude.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';

export const AnnouncementFindUniqueOrThrowSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), include: AnnouncementIncludeObjectSchema.optional(), where: AnnouncementWhereUniqueInputObjectSchema })