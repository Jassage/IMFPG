import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput> = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
export const AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string()
}).strict();
