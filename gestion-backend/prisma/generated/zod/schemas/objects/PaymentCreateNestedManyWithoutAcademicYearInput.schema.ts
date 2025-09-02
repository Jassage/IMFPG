import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { PaymentCreateWithoutAcademicYearInputObjectSchema } from './PaymentCreateWithoutAcademicYearInput.schema';
import { PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './PaymentUncheckedCreateWithoutAcademicYearInput.schema';
import { PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema } from './PaymentCreateOrConnectWithoutAcademicYearInput.schema';
import { PaymentCreateManyAcademicYearInputEnvelopeObjectSchema } from './PaymentCreateManyAcademicYearInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

export const PaymentCreateNestedManyWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutAcademicYearInput, z.ZodTypeDef, Prisma.PaymentCreateNestedManyWithoutAcademicYearInput> = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PaymentCreateNestedManyWithoutAcademicYearInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateWithoutAcademicYearInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutAcademicYearInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutAcademicYearInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAcademicYearInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
