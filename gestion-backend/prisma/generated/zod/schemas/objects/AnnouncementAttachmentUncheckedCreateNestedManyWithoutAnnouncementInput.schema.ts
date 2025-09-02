import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema } from './AnnouncementAttachmentCreateManyAnnouncementInputEnvelope.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './AnnouncementAttachmentWhereUniqueInput.schema'

export const AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInput> = z.object({
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema).array(), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AnnouncementAttachmentUncheckedCreateNestedManyWithoutAnnouncementInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema).array(), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
