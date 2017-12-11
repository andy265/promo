import { InMemoryDbService } from 'angular-in-memory-web-api';
import promotions from './promotions.json';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return { promotions };
  }
}
