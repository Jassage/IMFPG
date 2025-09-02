import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageUpdateWithoutAttachmentsInputObjectSchema } from './MessageUpdateWithoutAttachmentsInput.schema';
import { MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedUpdateWithoutAttachmentsInput.schema';
import { MessageCreateWithoutAttachmentsInputObjectSchema } from './MessageCreateWithoutAttachmentsInput.schema';
import { MessageUncheckedCreateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedCreateWithoutAttachmentsInput.schema';
import { MessageWhereInputObjectSchema } from './MessageWhereInput.schema'

export const MessageUpsertWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageUpsertWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageUpsertWithoutAttachmentsInput> = z.object({
  update: z.union([z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]),
  where: z.lazy(() => MessageWhereInputObjectSchema).optional()
}).strict();
export const MessageUpsertWithoutAttachmentsInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => MessageCreateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedCreateWithoutAttachmentsInputObjectSchema)]),
  where: z.lazy(() => MessageWhereInputObjectSchema).optional()
}).strict();
