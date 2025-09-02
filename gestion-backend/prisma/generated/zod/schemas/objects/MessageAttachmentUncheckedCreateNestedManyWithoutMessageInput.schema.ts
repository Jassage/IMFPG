import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { MessageAttachmentCreateWithoutMessageInputObjectSchema } from './MessageAttachmentCreateWithoutMessageInput.schema';
import { MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema } from './MessageAttachmentUncheckedCreateWithoutMessageInput.schema';
import { MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema } from './MessageAttachmentCreateOrConnectWithoutMessageInput.schema';
import { MessageAttachmentCreateManyMessageInputEnvelopeObjectSchema } from './MessageAttachmentCreateManyMessageInputEnvelope.schema';
import { MessageAttachmentWhereUniqueInputObjectSchema } from './MessageAttachmentWhereUniqueInput.schema'

export const MessageAttachmentUncheckedCreateNestedManyWithoutMessageInputObjectSchema: z.ZodType<Prisma.MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput, z.ZodTypeDef, Prisma.MessageAttachmentUncheckedCreateNestedManyWithoutMessageInput> = z.object({
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema).array(), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MessageAttachmentCreateManyMessageInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema), z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MessageAttachmentUncheckedCreateNestedManyWithoutMessageInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateWithoutMessageInputObjectSchema).array(), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentUncheckedCreateWithoutMessageInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema), z.lazy(() => MessageAttachmentCreateOrConnectWithoutMessageInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MessageAttachmentCreateManyMessageInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema), z.lazy(() => MessageAttachmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
