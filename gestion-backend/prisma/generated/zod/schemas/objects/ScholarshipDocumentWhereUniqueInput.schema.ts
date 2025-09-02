import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentWhereUniqueInput, z.ZodTypeDef, Prisma.ScholarshipDocumentWhereUniqueInput> = z.object({
  id: z.string()
}).strict();
export const ScholarshipDocumentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string()
}).strict();
