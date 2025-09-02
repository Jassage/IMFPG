import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AnnouncementCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateWithoutAttachmentsInput.schema';
import { AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema } from './AnnouncementUncheckedCreateWithoutAttachmentsInput.schema';
import { AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema } from './AnnouncementCreateOrConnectWithoutAttachmentsInput.schema';
import { AnnouncementWhereUniqueInputObjectSchema } from './AnnouncementWhereUniqueInput.schema'

export const AnnouncementCreateNestedOneWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.AnnouncementCreateNestedOneWithoutAttachmentsInput, z.ZodTypeDef, Prisma.AnnouncementCreateNestedOneWithoutAttachmentsInput> = z.object({
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema).optional()
}).strict();
export const AnnouncementCreateNestedOneWithoutAttachmentsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AnnouncementCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => AnnouncementUncheckedCreateWithoutAttachmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AnnouncementCreateOrConnectWithoutAttachmentsInputObjectSchema).optional(),
  connect: z.lazy(() => AnnouncementWhereUniqueInputObjectSchema).optional()
}).strict();
