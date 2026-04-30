import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorVisitsController } from './doctor-visits.controller';
import { DoctorVisitsService } from './doctor-visits.service';
import { DoctorVisit, DoctorVisitSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: DoctorVisit.name, schema: DoctorVisitSchema }])],
  controllers: [DoctorVisitsController],
  providers: [DoctorVisitsService],
})
export class DoctorVisitsModule {}
