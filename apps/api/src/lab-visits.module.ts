import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabVisitsController } from './lab-visits.controller';
import { LabVisitsService } from './lab-visits.service';
import { LabVisit, LabVisitSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: LabVisit.name, schema: LabVisitSchema }])],
  controllers: [LabVisitsController],
  providers: [LabVisitsService],
})
export class LabVisitsModule {}
