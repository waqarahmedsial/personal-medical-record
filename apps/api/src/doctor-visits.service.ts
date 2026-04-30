import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorVisit } from './schemas';
@Injectable()
export class DoctorVisitsService {
  constructor(@InjectModel(DoctorVisit.name) private model: Model<DoctorVisit>) {}
  list() { return this.model.find().sort({ date: -1 }); }
  create(payload: any) { return this.model.create(payload); }
}
