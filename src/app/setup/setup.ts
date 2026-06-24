import { Component, output, signal, inject } from '@angular/core';
import { GameConfig, GameService } from '../game.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.html',
  styleUrl: './setup.css',
})
export class SetupComponent {
  private svc = inject(GameService);

  readonly start = output<GameConfig>();

  len = signal<2 | 3>(2);

  setLen(l: 2 | 3) {
    this.len.set(l);
  }

  startGame() {
    const secret = this.svc.genRandom(this.len());
    this.start.emit({ mode: 'ai', len: this.len(), secret });
  }
}
