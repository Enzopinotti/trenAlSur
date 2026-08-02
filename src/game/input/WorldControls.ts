import Phaser from 'phaser';

export type MovementInput = {
  x: number;
  y: number;
};

export class WorldControls {
  private isDestroyed = false;
  private keys?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    G: Phaser.Input.Keyboard.Key;
    F2: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };

  constructor(keyboard: Phaser.Input.Keyboard.KeyboardPlugin) {
    this.keys = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      E: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      G: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
      F2: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F2),
      ESC: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  getMovement(): MovementInput {
    if (this.isDestroyed || !this.keys) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;

    const left = this.keys.A.isDown || this.keys.left.isDown;
    const right = this.keys.D.isDown || this.keys.right.isDown;
    const up = this.keys.W.isDown || this.keys.up.isDown;
    const down = this.keys.S.isDown || this.keys.down.isDown;

    if (left) x -= 1;
    if (right) x += 1;
    if (up) y -= 1;
    if (down) y += 1;

    if (x !== 0 && y !== 0) {
      x *= Math.SQRT1_2;
      y *= Math.SQRT1_2;
    }

    return { x, y };
  }

  justPressedInteract(): boolean {
    if (this.isDestroyed || !this.keys) return false;
    return Phaser.Input.Keyboard.JustDown(this.keys.E);
  }

  justPressedSave(): boolean {
    if (this.isDestroyed || !this.keys) return false;
    return Phaser.Input.Keyboard.JustDown(this.keys.G);
  }

  justPressedToggleDebug(): boolean {
    if (this.isDestroyed || !this.keys) return false;
    return Phaser.Input.Keyboard.JustDown(this.keys.F2);
  }

  justPressedMenu(): boolean {
    if (this.isDestroyed || !this.keys) return false;
    return Phaser.Input.Keyboard.JustDown(this.keys.ESC);
  }

  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    delete this.keys;
  }
}
