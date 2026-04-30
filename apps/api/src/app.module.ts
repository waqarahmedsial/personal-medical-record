import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from './catalog.module';
import { DoctorVisitsModule } from './doctor-visits.module';
import { LabVisitsModule } from './lab-visits.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/pmr'),
    CatalogModule,
    DoctorVisitsModule,
    LabVisitsModule,
  ],
})
export class AppModule {}
