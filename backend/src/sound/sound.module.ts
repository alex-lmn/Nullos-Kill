import { Module } from '@nestjs/common';
import { SoundGateway } from './sound.gateway';

@Module({
  providers: [SoundGateway],
  exports: [SoundGateway],
})
export class SoundModule {}
