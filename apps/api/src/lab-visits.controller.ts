import { Body, Controller, Get, Post } from '@nestjs/common';
import { LabVisitsService } from './lab-visits.service';
@Controller('lab-visits')
export class LabVisitsController {
  constructor(private readonly service: LabVisitsService) {}
  @Get() list() { return this.service.list(); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
}
