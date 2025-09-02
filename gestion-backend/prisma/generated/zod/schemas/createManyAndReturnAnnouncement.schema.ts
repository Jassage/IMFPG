import { z } from 'zod';
import { AnnouncementSelectObjectSchema } from './objects/AnnouncementSelect.schema';
import { AnnouncementCreateManyInputObjectSchema } from './objects/AnnouncementCreateManyInput.schema';

export const AnnouncementCreateManyAndReturnSchema = z.object({ select: AnnouncementSelectObjectSchema.optional(), data: z.union([ AnnouncementCreateManyInputObjectSchema, z.array(AnnouncementCreateManyInputObjectSchema) ]),  }).strict()