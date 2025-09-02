import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementWhereUniqueInputObjectSchema } from './AnnouncementWhereUniqueInput.schema';
import { AnnouncementCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedCreateWithoutAttachmentsInput.schema'

export const AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.AnnouncementCreateOrConnectWithoutAttachmentsInput, z.ZodTypeDef, Prisma.AnnouncementCreateOrConnectWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)])
}).strict();
export const AnnouncementCreateOrConnectWithoutAttachmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)])
}).strict();
