import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutGuardiansInputObjectSchema } from './StudentCreateWithoutGuardiansInput.schema';
import { StudentUncheckedCreateWithoutGuardiansInputObjectSchema } from './StudentUncheckedCreateWithoutGuardiansInput.schema';
import { StudentCreateOrConnectWithoutGuardiansInputObjectSchema } from './StudentCreateOrConnectWithoutGuardiansInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutGuardiansInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutGuardiansInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutGuardiansInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGuardiansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutGuardiansInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutGuardiansInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
