import { Station, StationDetail, StationPrices } from './station';
export interface TKListResponse {
    ok: boolean;
    license: string;
    data: string;
    status: string;
    stations: Station[];
    message?: string;
}
export interface TKDetailResponse {
    ok: boolean;
    license: string;
    data: string;
    status: string;
    station: StationDetail;
    message?: string;
}
export interface TKPricesResponse {
    ok: boolean;
    license: string;
    data: string;
    prices: Record<string, StationPrices>;
    message?: string;
}
export interface APIErrorResponse {
    ok: false;
    message: string;
}
//# sourceMappingURL=api-response.d.ts.map