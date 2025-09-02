import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutGradesInputObjectSchema } from './AcademicYearCreateWithoutGradesInput.schema';
import { AcademicYearUncheckedCreateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedCreateWithoutGradesInput.schema';
import { AcademicYearCreateOrConnectWithoutGradesInputObjectSchema } from './AcademicYearCreateOrConnectWithoutGradesInput.schema';
import { AcademicYearUpsertWithoutGradesInputObjectSchema } from './AcademicYearUpsertWithoutGradesInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearUpdateToOneWithWhereWithoutGradesInputObjectSchema } from './AcademicYearUpdateToOneWithWhereWithoutGradesInput.schema';
import { AcademicYearUpdateWithoutGradesInputObjectSchema } from './AcademicYearUpdateWithoutGradesInput.schema';
import { AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutGradesInput.schema'

export const AcademicYearUpdateOneRequiredWithoutGradesNestedInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateOneRequiredWithoutGradesNestedInput, z.ZodTypeDef, Prisma.AcademicYearUpdateOneRequiredWithoutGradesNestedInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
export const AcademicYearUpdateOneRequiredWithoutGradesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutGradesInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutGradesInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
