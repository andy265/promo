export class Promo {
  id: number;
  name: string;
  startTimestamp: number;
  endTimestamp: number;

  constructor({
    id,
    name,
    startTimestamp,
    endTimestamp
  }: {
    id?: number,
    name?: string,
    startTimestamp?: number,
    endTimestamp?: number
  } = {}) {
    this.id = id;
    this.name = name;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
  }

  isEqualTo(promo: Promo): boolean {
    for (const prop in promo) {
      if (promo.hasOwnProperty(prop)) {
        if (promo[prop] !== this[prop]) {
          return false;
        }
      }
    }
    return true;
  }
}
