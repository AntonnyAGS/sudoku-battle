export interface HealthPort {
  isAvailable(): Promise<boolean>;
}

export class GetAvailability {
  constructor(private readonly health: HealthPort) {}

  execute(): Promise<boolean> {
    return this.health.isAvailable();
  }
}
