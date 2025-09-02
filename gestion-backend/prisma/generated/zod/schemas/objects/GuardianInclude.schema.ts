import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema'

export const GuardianIncludeObjectSchema: z.ZodType<Prisma.GuardianInclude, z.ZodTypeDef, Prisma.GuardianInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
export const GuardianIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional()
}).strict();
