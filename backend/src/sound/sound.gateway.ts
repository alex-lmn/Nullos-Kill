import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SoundGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private soundSettings = {
    cooldown: 60,
    maxDelay: 15,
    volume: 1.0,
    channel: 'alex_lmn'
  };

  afterInit(server: Server) {
    console.log('Sound WebSocket initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Send current sound settings to new clients immediately
    client.emit('soundSettingsUpdate', this.soundSettings);
  }

  handleDisconnect(client: Socket) {
    // Client disconnected
  }

  @SubscribeMessage('updateSoundSettings')
  handleSoundSettings(client: Socket, settings: any) {
    console.log('Updating sound settings:', settings);
    this.soundSettings = { ...this.soundSettings, ...settings };
    // Broadcast new settings to all clients (Admin + Stream)
    this.server.emit('soundSettingsUpdate', this.soundSettings);
  }

  @SubscribeMessage('triggerSound')
  handleTriggerSound(client: Socket, payload: { command: string }) {
    console.log('Triggering sound:', payload.command);
    // Relay the command to all clients to play/animate
    this.server.emit('playSound', payload);
  }
}
