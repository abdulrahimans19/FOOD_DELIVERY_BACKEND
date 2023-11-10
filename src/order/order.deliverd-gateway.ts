import { Injectable } from '@nestjs/common';
import { io, Socket as SocketClient } from 'socket.io-client';
import { OrderService } from './order.service';

@Injectable()
export class WebSocketDeliverClientService {
  private clientSocket: SocketClient;

  constructor(private readonly orerService: OrderService) {
    this.clientSocket = io('http://localhost:3001');

    this.clientSocket.on('connect', () => {
      console.log('Connected to the Delivery Boy Server ');
    });

    this.clientSocket.on('disconnect', () => {
      console.log('Disconnected from Delivery Server');
    });

    this.clientSocket.on('delivered', async (data) => {
      async function saveStatus(data) {
        await orerService.updateDeliverdStatus(data);
        console.log(data);
      }
      saveStatus(data);
    });
  }
}
