import mitt from 'mitt';
import type { GameEvents } from '@/types/contracts';

type Events = {
  [K in GameEvents]?: any;
};

export const bus = mitt<Events>();

export const emitToast = (msg: string) => bus.emit('ui:toast', msg);
