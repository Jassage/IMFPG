import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCreateWithoutScholarshipInputObjectSchema } from './AcademicYearCreateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedCreateWithoutScholarshipInput.schema';
import { AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema } from './AcademicYearCreateOrConnectWithoutScholarshipInput.schema';
import { AcademicYearUpsertWithoutScholarshipInputObjectSchema } from './AcademicYearUpsertWithoutScholarshipInput.schema';
import { AcademicYearWhereUniqueInputObjectSchema } from './AcademicYearWhereUniqueInput.schema';
import { AcademicYearUpdateToOneWithWhereWithoutScholarshipInputObjectSchema } from './AcademicYearUpdateToOneWithWhereWithoutScholarshipInput.schema';
import { AcademicYearUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUpdateWithoutScholarshipInput.schema';
import { AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema } from './AcademicYearUncheckedUpdateWithoutScholarshipInput.schema'

export const AcademicYearUpdateOneRequiredWithoutScholarshipNestedInputObjectSchema: z.ZodType<Prisma.AcademicYearUpdateOneRequiredWithoutScholarshipNestedInput, z.ZodTypeDef, Prisma.AcademicYearUpdateOneRequiredWithoutScholarshipNestedInput> = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutScholarshipInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)]).optional()
}).strict();
export const AcademicYearUpdateOneRequiredWithoutScholarshipNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => AcademicYearCreateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedCreateWithoutScholarshipInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => AcademicYearCreateOrConnectWithoutScholarshipInputObjectSchema).optional(),
  upsert: z.lazy(() => AcademicYearUpsertWithoutScholarshipInputObjectSchema).optional(),
  connect: z.lazy(() => AcademicYearWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => AcademicYearUpdateToOneWithWhereWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUpdateWithoutScholarshipInputObjectSchema), z.lazy(() => AcademicYearUncheckedUpdateWithoutScholarshipInputObjectSchema)]).optional()
}).strict();
