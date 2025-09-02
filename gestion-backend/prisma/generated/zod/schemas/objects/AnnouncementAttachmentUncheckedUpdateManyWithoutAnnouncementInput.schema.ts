import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentUncheckedUpdateManyWithoutAnnouncementInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
