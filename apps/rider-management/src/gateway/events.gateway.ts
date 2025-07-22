/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utility/auth';
import { Rider } from '../models/rider.model';
import { Order } from '../models/order.model';

export interface CoordinateInterface {
  latitude: number;
  longitude: number;
}

export interface RouteInterface {
  start_point: CoordinateInterface;
  end_point: CoordinateInterface;
}

@WebSocketGateway({ namespace: 'dispatch', cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private socketClients: Map<string, string> = new Map(); // socketId -> userId

  // Handle when a client connects
  handleConnection(socketClient: Socket) {
    console.log('Client connected:', socketClient.id);
    socketClient.emit('message', 'Welcome to food court WebSocket server');

    // Captures the user's authorization token. Rider or admin user
    const token =
      socketClient.handshake.auth.token ||
      socketClient.handshake.headers['authorization'];

    if (token) {
      const { sub: userId, riderId } = verifyToken(`${token}`);

      //Adds validated user/rider to the socket clients
      if (userId) this.socketClients.set(socketClient.id, userId);
      if (riderId) this.socketClients.set(socketClient.id, `${riderId}`);
    }
  }

  handleDisconnect(socketClient: Socket) {
    this.socketClients.delete(socketClient.id);
    console.log(`Client disconnected: ${socketClient.id}`);
  }

  @SubscribeMessage('rider_live_location')
  handleRiderLiveLocation(
    socketClient: Socket,
    payload: { riderId: number; latitude: number; longitude: number },
  ) {
    try {
      const { riderId } = payload;
      this.socketClients.set(socketClient.id, `${riderId}`);
    } catch (error) {
      console.error(error);
    }
  }

  broadcastRiderLiveLocation(rider: Rider) {
    console.log(
      `rider ${rider.name} with id: ${rider.id}, whose availability is ${rider.is_available}, is currently at lat:${rider.current_latitude} and lng:${rider.current_longitude}`,
    );
    this.server.emit('rider_live_location', rider);
    this.socketClients.set('rider', JSON.stringify(rider));
  }

  sendOrderToRIder(riderId: number, order: Order) {
    for (const [socketId, rId] of this.socketClients) {
      if (rId === String(riderId)) {
        this.server.to(socketId).emit('new-order', order);
      }
    }
  }
}
