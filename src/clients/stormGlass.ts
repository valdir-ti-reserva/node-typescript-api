import { AxiosStatic } from 'axios'

export interface StormGlassPointSource {
  [key: string]: number
}

export interface StormGlassPoint {
  readonly time: string
  readonly waveHeight: StormGlassPointSource
  readonly waveDirection: StormGlassPointSource
  readonly swellDirection: StormGlassPointSource
  readonly swellHeight: StormGlassPointSource
  readonly swellPeriod: StormGlassPointSource
  readonly windDirection: StormGlassPointSource
  readonly windSpeed: StormGlassPointSource
}

export interface StormGlassForeCastResponse {
  hours: StormGlassPoint[]
}

export interface ForecastPoint {
  time: string
  waveHeight: number
  waveDirection: number
  swellDirection: number
  swellHeight: number
  swellPeriod: number
  windDirection: number
  windSpeed: number
}

export class StormGlass {

  readonly stormGlassApiParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed'
  readonly stormGlassApiSource = 'noaa'

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForeCastResponse>(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&end=1592113802&lat=${lat}&lng=${lng}`,
      {
        headers: {
          Authorization: 'fake-api',
        }
      }
    )
    return this.normalizeResponse(response.data)
  }

  private normalizeResponse(points: StormGlassForeCastResponse): ForecastPoint[] {
    return points.hours
          .filter(this.isValidPoint.bind(this))
          .map((point) => ({
            time: point.time,
            swellDirection: point.swellDirection[this.stormGlassApiSource],
            swellHeight: point.swellHeight[this.stormGlassApiSource],
            swellPeriod: point.swellPeriod[this.stormGlassApiSource],
            waveDirection: point.waveDirection[this.stormGlassApiSource],
            waveHeight: point.waveHeight[this.stormGlassApiSource],
            windSpeed: point.windSpeed[this.stormGlassApiSource],
            windDirection: point.windDirection[this.stormGlassApiSource],
    }))
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassApiSource] &&
      point.swellHeight?.[this.stormGlassApiSource] &&
      point.swellPeriod?.[this.stormGlassApiSource] &&
      point.waveDirection?.[this.stormGlassApiSource] &&
      point.waveHeight?.[this.stormGlassApiSource] &&
      point.windSpeed?.[this.stormGlassApiSource] &&
      point.windDirection?.[this.stormGlassApiSource]
    )
  }
}
