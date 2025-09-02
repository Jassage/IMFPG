import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema } from './AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInput.schema'

export const AnnouncementAttachmentUpdateInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUpdateInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUpdateInput> = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  announcement: z.lazy(() => AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema).optional()
}).strict();
export const AnnouncementAttachmentUpdateInputObjectZodSchema = z.object({
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  announcement: z.lazy(() => AnnouncementUpdateOneRequiredWithoutAttachmentsNestedInputObjectSchema).optional()
}).strict();
