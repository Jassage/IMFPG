import { z } from 'zod';
import { AnnouncementCreateManyInputObjectSchema } from './objects/AnnouncementCreateManyInput.schema';

export const AnnouncementCreateManySchema = z.object({ data: z.union([ AnnouncementCreateManyInputObjectSchema, z.array(AnnouncementCreateManyInputObjectSchema) ]),  })