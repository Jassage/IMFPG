import { z } from 'zod';
import { AnnouncementUpdateManyMutationInputObjectSchema } from './objects/AnnouncementUpdateManyMutationInput.schema';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';

export const AnnouncementUpdateManySchema = z.object({ data: AnnouncementUpdateManyMutationInputObjectSchema, where: AnnouncementWhereInputObjectSchema.optional()  })