import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MedicineCatalog { @Prop({ required: true, unique: true }) name!: string; @Prop() category?: string; @Prop() defaultRoute?: string; @Prop() notes?: string; }
export const MedicineCatalogSchema = SchemaFactory.createForClass(MedicineCatalog);

@Schema({ timestamps: true })
export class LabTestCatalog { @Prop({ required: true, unique: true }) name!: string; @Prop() panel?: string; @Prop() defaultUnit?: string; @Prop() refLow?: number; @Prop() refHigh?: number; @Prop() notes?: string; }
export const LabTestCatalogSchema = SchemaFactory.createForClass(LabTestCatalog);

@Schema({ _id: false })
export class Prescription { @Prop({ required: true }) medicineName!: string; @Prop({ required: true }) dosage!: string; @Prop({ required: true }) frequency!: string; @Prop({ type: [String], default: [] }) timingQualifiers!: string[]; @Prop() startDate?: string; @Prop() endDate?: string; @Prop({ required: true }) status!: string; @Prop() notes?: string; }

@Schema({ timestamps: true })
export class DoctorVisit { @Prop({ required: true }) date!: string; @Prop({ required: true }) doctor!: string; @Prop() specialty?: string; @Prop() notes?: string; @Prop({ type: [SchemaFactory.createForClass(Prescription)], default: [] }) prescriptions!: Prescription[]; }
export const DoctorVisitSchema = SchemaFactory.createForClass(DoctorVisit);

@Schema({ _id: false })
export class LabResult { @Prop({ required: true }) testName!: string; @Prop({ required: true }) value!: string; @Prop() unit?: string; @Prop() refLow?: number; @Prop() refHigh?: number; @Prop() notes?: string; }

@Schema({ timestamps: true })
export class LabVisit { @Prop({ required: true }) date!: string; @Prop({ required: true }) labName!: string; @Prop() reportRef?: string; @Prop({ type: [SchemaFactory.createForClass(LabResult)], default: [] }) results!: LabResult[]; }
export const LabVisitSchema = SchemaFactory.createForClass(LabVisit);
