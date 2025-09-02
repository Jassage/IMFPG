import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnnouncementWhereUniqueInputObjectSchema: z.ZodType<Prisma.AnnouncementWhereUniqueInput, z.ZodTypeDef, Prisma.AnnouncementWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const AnnouncementWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
