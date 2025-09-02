import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementIncludeObjectSchema } from './objects/AnnouncementInclude.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './objects/AnnouncementWhereUniqueInput.schema';
import { AnnouncementCreateInputObjectSchema } from './objects/AnnouncementCreateInput.schema';
import { AnnouncementUncheckedCreateInputObjectSchema } from './objects/AnnouncementUncheckedCreateInput.schema';
import { AnnouncementUpdateInputObjectSchema } from './objects/AnnouncementUpdateInput.schema';
import { AnnouncementUncheckedUpdateInputObjectSchema } from './objects/AnnouncementUncheckedUpdateInput.schema';

export const AnnouncementUpsertSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), include: AnnouncementIncludeObjectSchema.optional(), where: AnnouncementWhereUniqueInputObjectSchema, create: z.union([ AnnouncementCreateInputObjectSchema, AnnouncementUncheckedCreateInputObjectSchema ]), update: z.union([ AnnouncementUpdateInputObjectSchema, AnnouncementUncheckedUpdateInputObjectSchema ])  })