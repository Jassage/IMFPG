import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementWhereInputObjectSchema } from './AnnouncementWhereInput.schema';
import { AnnouncementUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUpdateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedUpdateWithoutAttachmentsInput.schema'

export const AnnouncementUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.AnnouncementUpdateToOneWithWhereWithoutAttachmentsInput, z.ZodTypeDef, Prisma.AnnouncementUpdateToOneWithWhereWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => AnnouncementWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)])
}).strict();
export const AnnouncementUpdateToOneWithWhereWithoutAttachmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => AnnouncementUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedUpdateWithoutAttachmentsInputObjectSchema)])
}).strict();
