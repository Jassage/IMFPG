import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentUncheckedUpdateWithoutAnnouncementInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
