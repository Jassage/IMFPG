import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUpdateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput.schema'

export const AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInput> = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema)]),
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema)])
}).strict();
export const AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema)]),
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema)])
}).strict();
