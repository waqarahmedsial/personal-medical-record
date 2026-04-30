import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabVisit } from './schemas';
@Injectable()
export class LabVisitsService {
  constructor(@InjectModel(LabVisit.name) private model: Model<LabVisit>) {}
  list() { return this.model.find().sort({ date: -1 }); }
  create(payload: any) { return this.model.create(payload); }
}
