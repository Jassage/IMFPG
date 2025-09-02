import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const CourseAssignmentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.CourseAssignmentCountOutputTypeSelect, z.ZodTypeDef, Prisma.CourseAssignmentCountOutputTypeSelect> = z.object({
  schedules: z.boolean().optional()
}).strict();
export const CourseAssignmentCountOutputTypeSelectObjectZodSchema = z.object({
  schedules: z.boolean().optional()
}).strict();
