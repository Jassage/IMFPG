import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUpdateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInput.schema'

export const AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInput> = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema)])
}).strict();
export const AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema)])
}).strict();
