import { IsString, Matches } from 'class-validator';

const UUID_CSV_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(,[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})*$/i;

export class GetPricesDto {
  @IsString()
  @Matches(UUID_CSV_REGEX, {
    message: 'ids must be a comma-separated list of valid UUIDs',
  })
  ids: string;
}
