import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentUpdateWithoutMessageInputObjectSchema } from './MessageAttachmentUpdateWithoutMessageInput.schema';
import { MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedUpdateWithoutMessageInput.schema'

export const MessageAttachmentUpdateWithWhereUniqueWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUpdateWithWhereUniqueWithoutMessageInput> = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MessageAttachmentUpdateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema)])
}).strict();
export const MessageAttachmentUpdateWithWhereUniqueWithoutMessageInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MessageAttachmentUpdateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema)])
}).strict();
