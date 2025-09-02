import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInput, z.ZodTypeDef, Prisma.UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInput> = z.object({
  ueId: z.string(),
  prerequisiteId: z.string()
}).strict();
export const UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInputObjectZodSchema = z.object({
  ueId: z.string(),
  prerequisiteId: z.string()
}).strict();
