import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.AnnouncementCountOutputTypeSelect, z.ZodTypeDef, Prisma.AnnouncementCountOutputTypeSelect> = z.object({
  attachments: z.boolean().optional()
}).strict();
export const AnnouncementCountOutputTypeSelectObjectZodSchema = z.object({
  attachments: z.boolean().optional()
}).strict();
