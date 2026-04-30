import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { MedicineCatalog, MedicineCatalogSchema, LabTestCatalog, LabTestCatalogSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MedicineCatalog.name, schema: MedicineCatalogSchema },
      { name: LabTestCatalog.name, schema: LabTestCatalogSchema },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
