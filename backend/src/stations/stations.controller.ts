import { Controller, Get, Param, Query } from '@nestjs/common';
import { StationsService } from './stations.service';
import { SearchStationsDto } from './dto/search-stations.dto';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get('search')
  async search(@Query() query: SearchStationsDto) {
    const stations = await this.stationsService.search(
      query.lat,
      query.lng,
      query.rad,
      query.type,
      query.sort,
    );
    return { ok: true, stations };
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const station = await this.stationsService.getDetail(id);
    return { ok: true, station };
  }
}
