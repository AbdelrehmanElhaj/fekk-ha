import { Component, output, signal, computed, inject } from '@angular/core';
import { GameConfig, GameService } from '../game.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.html',
  styleUrl: './setup.css',
})
export class SetupComponent {
  private svc = inject(GameService);

  readonly start = output<GameConfig>();

  mode = signal<'vs' | 'ai'>('vs');
  len = signal<2 | 3>(2);
  digs = signal<number[]>([0, 1]);

  readonly names: Record<2 | 3, string[]> = {
    2: ['الأولى', 'الثانية'],
    3: ['الأولى', 'الثانية', 'الثالثة'],
  };

  readonly hasDup = computed(() => this.svc.hasDup(this.digs()));
  readonly canStart = computed(() => this.mode() === 'ai' || !this.hasDup());

  setMode(m: 'vs' | 'ai') {
    this.mode.set(m);
  }

  setLen(l: 2 | 3) {
    this.len.set(l);
    this.digs.set(l === 2 ? [0, 1] : [0, 1, 2]);
  }

  moveDig(i: number, dir: number) {
    const d = [...this.digs()];
    d[i] = (d[i] + dir + 10) % 10;
    this.digs.set(d);
  }

  startGame() {
    if (!this.canStart()) return;
    const secret =
      this.mode() === 'ai' ? this.svc.genRandom(this.len()) : this.digs().join('');
    this.start.emit({ mode: this.mode(), len: this.len(), secret });
  }
}
