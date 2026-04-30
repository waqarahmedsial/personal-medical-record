import { Body, Controller, Get, Post } from '@nestjs/common';
import { DoctorVisitsService } from './doctor-visits.service';
@Controller('doctor-visits')
export class DoctorVisitsController {
  constructor(private readonly service: DoctorVisitsService) {}
  @Get() list() { return this.service.list(); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
}
