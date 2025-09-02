import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementUpdateManyMutationInputObjectSchema } from './objects/AnnouncementUpdateManyMutationInput.schema';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';

export const AnnouncementUpdateManyAndReturnSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), data: AnnouncementUpdateManyMutationInputObjectSchema, where: AnnouncementWhereInputObjectSchema.optional()  }).strict()