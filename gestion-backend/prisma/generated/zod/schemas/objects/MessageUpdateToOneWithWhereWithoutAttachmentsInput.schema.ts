import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageWhereInputObjectSchema } from './MessageWhereInput.schema';
import { MessageUpdateWithoutAttachmentsInputObjectSchema } from './MessageUpdateWithoutAttachmentsInput.schema';
import { MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema } from './MessageUncheckedUpdateWithoutAttachmentsInput.schema'

export const MessageUpdateToOneWithWhereWithoutAttachmentsInputObjectSchema: z.ZodType<Prisma.MessageUpdateToOneWithWhereWithoutAttachmentsInput, z.ZodTypeDef, Prisma.MessageUpdateToOneWithWhereWithoutAttachmentsInput> = z.object({
  where: z.lazy(() => MessageWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)])
}).strict();
export const MessageUpdateToOneWithWhereWithoutAttachmentsInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MessageUpdateWithoutAttachmentsInputObjectSchema), z.lazy(() => MessageUncheckedUpdateWithoutAttachmentsInputObjectSchema)])
}).strict();
