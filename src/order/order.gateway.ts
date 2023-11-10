import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { OrderNotification } from './dto';
  
  @WebSocketGateway()
  export class OrderGateway {
    @WebSocketServer() server: Server;
    @SubscribeMessage('orderPlaced')
    handleOrderPlaced(client: Socket, orderId:OrderNotification,) {
      client.emit('orderPlaced', orderId);
    }
  }
  