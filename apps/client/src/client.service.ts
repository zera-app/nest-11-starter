import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {
  getHello(): string {
    return 'Hello World!';
  }
}
