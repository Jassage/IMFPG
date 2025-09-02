import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

export const AnnouncementAttachmentUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.AnnouncementAttachmentUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.AnnouncementAttachmentUncheckedUpdateManyInput> = z.object({
  announcementId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const AnnouncementAttachmentUncheckedUpdateManyInputObjectZodSchema = z.object({
  announcementId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  url: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
