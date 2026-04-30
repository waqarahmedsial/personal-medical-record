import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}
  @Get('medicines') medicines() { return this.service.medicines(); }
  @Post('medicines') addMedicine(@Body() body: any) { return this.service.addMedicine(body); }
  @Get('tests') tests() { return this.service.tests(); }
  @Post('tests') addTest(@Body() body: any) { return this.service.addTest(body); }
}
