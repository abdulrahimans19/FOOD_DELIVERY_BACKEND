import { Injectable } from '@nestjs/common';
import { io, Socket as SocketClient } from 'socket.io-client';
import { OrderService } from './order.service';

@Injectable()
export class WebSocketClientService {
  private clientSocket: SocketClient;

  constructor(private readonly orerService: OrderService) {
    this.clientSocket = io('http://localhost:3001');

    this.clientSocket.on('connect', () => {
      console.log('Connected to the Resturent  Server');
    });

    this.clientSocket.on('disconnect', () => {
      console.log('Disconnected from Resturent Server');
    });

    this.clientSocket.on('foodReady', async (data) => {
      async function saveStatus(data) {
        await orerService.updateStatus(data);
        console.log(data);
      }
      saveStatus(data);
    });
    this.clientSocket.on('foodPicked', async (data) => {
      async function saveStatus(data) {
        await orerService.updateFoodPicked(data);
        console.log(data);
      }
      saveStatus(data);
    });
  }
}
