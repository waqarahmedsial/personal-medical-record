import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicineCatalog, LabTestCatalog } from './schemas';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(MedicineCatalog.name) private medModel: Model<MedicineCatalog>,
    @InjectModel(LabTestCatalog.name) private labModel: Model<LabTestCatalog>,
  ) {}
  medicines() { return this.medModel.find().sort({ name: 1 }); }
  addMedicine(payload: any) { return this.medModel.create(payload); }
  tests() { return this.labModel.find().sort({ name: 1 }); }
  addTest(payload: any) { return this.labModel.create(payload); }
}
