import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './MessageAttachmentWhereUniqueInput.schema';
import { MessageAttachmentUpdateWithoutMessageInputObjectSchema } from './MessageAttachmentUpdateWithoutMessageInput.schema';
import { MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedUpdateWithoutMessageInput.schema';
import { MessageAttachmentCreateWithoutMessageInputObjectSchema } from './MessageAttachmentCreateWithoutMessageInput.schema';
import { MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedCreateWithoutMessageInput.schema'

export const MessageAttachmentUpsertWithWhereUniqueWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUpsertWithWhereUniqueWithoutMessageInput> = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MessageAttachmentUpdateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema)]),
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema)])
}).strict();
export const MessageAttachmentUpsertWithWhereUniqueWithoutMessageInputObjectZodSchema = z.object({
  where: z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MessageAttachmentUpdateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedUpdateWithoutMessageInputObjectSchema)]),
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema)])
}).strict();
