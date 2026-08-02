import mitt from 'mitt';
import type { GameEvents } from '@/types/contracts';

type Events = {
  [K in GameEvents]?: unknown;
};

export const bus = mitt<Events>();

export const emitToast = (msg: string) => bus.emit('ui:toast', msg);
