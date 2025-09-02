import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementAttachmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentWhereUniqueInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const AnnouncementAttachmentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
