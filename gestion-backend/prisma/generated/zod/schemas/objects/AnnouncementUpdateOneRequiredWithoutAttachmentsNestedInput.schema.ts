import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedCreateWithoutAttachmentsInput.schema';
import { AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateOrConnectWithoutAttachmentsInput.schema';
import { AnnouncementUpsertWithoutAttachmentsInputObjectSchema } from './AnnouncementUpsertWithoutAttachmentsInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './AnnouncementWhereUniqueInput.schema';
import { AnnouncementUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema } from './AnnouncementUpdateToOneWithWhereWithoutAttachmentsInput.schema';
import { AnnouncementUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUpdateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedUpdateWithoutAttachmentsInput.schema'

export const AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema: z.ZodType<Prisma.AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInput, z.ZodTypeDef, Prisma.AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInput> = z.object({
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AnnouncementUpsertWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AnnouncementUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => AnnouncementUpsertWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AnnouncementUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)]).optional()
}).strict();
