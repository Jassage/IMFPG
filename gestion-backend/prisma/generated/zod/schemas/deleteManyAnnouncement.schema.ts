import { z } from 'zod';
import { AnnouncementWhereInputObjectSchema } from './objects/AnnouncementWhereInput.schema';

export const AnnouncementDeleteManySchema = z.object({ where: AnnouncementWhereInputObjectSchema.optional()  })