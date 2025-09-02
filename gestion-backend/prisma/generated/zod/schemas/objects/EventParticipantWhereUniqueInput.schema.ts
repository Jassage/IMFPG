import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EventParticipantWhereUniqueInputObjectSchema: z.ZodType<Prisma.EventParticipantWhereUniqueInput, z.ZodTypeDef, Prisma.EventParticipantWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const EventParticipantWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
