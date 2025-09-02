import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInputObjectSchema } from './UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInput.schema'

export const UEPrerequisiteWhereUniqueInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteWhereUniqueInput, z.ZodTypeDef, Prisma.UEPrerequisiteWhereUniqueInput> = z.object({
  id: z.string(),
  ueId_prerequisiteId: z.lazy(() => UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInputObjectSchema)
}).strict();
export const UEPrerequisiteWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  ueId_prerequisiteId: z.lazy(() => UEPrerequisiteUeIdPrerequisiteIdCompoundUniqueInputObjectSchema)
}).strict();
