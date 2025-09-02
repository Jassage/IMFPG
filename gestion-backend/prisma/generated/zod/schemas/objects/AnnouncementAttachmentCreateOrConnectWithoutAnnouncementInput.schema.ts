import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput.schema'

export const AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInput> = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema)])
}).strict();
export const AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema)])
}).strict();
