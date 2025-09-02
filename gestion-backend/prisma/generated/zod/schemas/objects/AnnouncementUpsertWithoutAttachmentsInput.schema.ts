import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUpdateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedUpdateWithoutAttachmentsInput.schema';
import { AnnouncementCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedCreateWithoutAttachmentsInput.schema';
import { AnnouncementWhereInputObjectSchema } from './AnnouncementWhereInput.schema'

export const AnnouncementUpsertWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.AnnouncementUpsertWithoutAttachmentsInput, z.ZodTypeDef, Prisma.AnnouncementUpsertWithoutAttachmentsInput> = z.object({
  update: z.union([z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]),
  where: z.lazy(() => AnnouncementWhereInputObjectSchema).optional()
}).strict();
export const AnnouncementUpsertWithoutAttachmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]),
  where: z.lazy(() => AnnouncementWhereInputObjectSchema).optional()
}).strict();
