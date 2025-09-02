import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema } from './AnnouncementAttachmentCreateManyAnnouncementInputEnvelope.schema';
import { AnnouncementAttachmentWhereUniqueInputObjectSchema } from './AnnouncementAttachmentWhereUniqueInput.schema';
import { AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema } from './AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInput.schema';
import { AnnouncementAttachmentScalarWhereInputObjectSchema } from './AnnouncementAttachmentScalarWhereInput.schema'

export const AnnouncementAttachmentUpdateManyWithoutAnnouncementNestedInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateManyWithoutAnnouncementNestedInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateManyWithoutAnnouncementNestedInput> = z.object({
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema).array(), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AnnouncementAttachmentUpdateManyWithoutAnnouncementNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateWithoutAnnouncementInputObjectSchema).array(), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUncheckedCreateWithoutAnnouncementInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentCreateOrConnectWithoutAnnouncementInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpsertWithWhereUniqueWithoutAnnouncementInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AnnouncementAttachmentCreateManyAnnouncementInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema), z.lazy(() => AnnouncementAttachmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpdateWithWhereUniqueWithoutAnnouncementInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema), z.lazy(() => AnnouncementAttachmentUpdateManyWithWhereWithoutAnnouncementInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema), z.lazy(() => AnnouncementAttachmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
