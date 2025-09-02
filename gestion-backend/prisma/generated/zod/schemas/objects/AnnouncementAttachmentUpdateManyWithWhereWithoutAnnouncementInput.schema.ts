import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentScalarWhereInputObjectSchema } from './AnnouncementAttachmentScalarWhereInput.schema';
import { AnnouncementAttachmentUpdateManyMutationInputObjectSchema } from './AnnouncementAttachmentUpdateManyMutationInput.schema';
import { AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInput.schema'

export const AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInput> = z.object({
  where: z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AnnouncementAttachmentUpdateManyMutationInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInputObjectSchema)])
}).strict();
export const AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AnnouncementAttachmentUpdateManyMutationInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInputObjectSchema)])
}).strict();
