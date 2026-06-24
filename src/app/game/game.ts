import { Component, input, output, signal, computed, inject } from '@angular/core';
import { GameConfig, GameService, HintType } from '../game.service';

export interface GuessEntry {
  num: number;
  guess: string;
  hints: HintType[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent {
  private svc = inject(GameService);

  config = input.required<GameConfig>();
  newGame = output<void>();

  guessValue = signal('');
  history = signal<GuessEntry[]>([]);
  over = signal(false);

  readonly attCount = computed(() => {
    const n = this.history().length;
    if (n === 0) return '٠ محاولة';
    return this.svc.toAr(n) + (n === 1 ? ' محاولة' : ' محاولات');
  });

  readonly modePill = computed(() =>
    this.config().mode === 'ai' ? '🤖 ضد الذكاء' : '🤝 لاعب ضد لاعب'
  );

  readonly inputLabel = computed(() =>
    this.config().len === 2
      ? 'أدخل تخمينك — رقمان مختلفان (٠-٩)'
      : 'أدخل تخمينك — ثلاثة أرقام مختلفة (٠-٩)'
  );

  readonly isValid = computed(() => {
    const v = this.guessValue();
    const len = this.config().len;
    return v.length === len && /^\d+$/.test(v) && !this.svc.hasDup(v.split(''));
  });

  readonly isInvalid = computed(() =>
    this.guessValue().length === this.config().len && !this.isValid()
  );

  readonly winStar = computed(() => {
    const n = this.history().length;
    return n <= 3 ? '🥇' : n <= 6 ? '🥈' : '🥉';
  });

  secretDigits(): string[] {
    return this.config().secret.split('');
  }

  tileClass(hint: HintType, len: number): string {
    return 'hint-tile ' + hint + (len === 3 ? ' t3' : '');
  }

  tileSym(hint: HintType): string {
    return hint === 'correct' ? '✅' : hint === 'wrong-pos' ? '🟡' : '❌';
  }

  winAttCount(): string {
    const n = this.history().length;
    return this.svc.toAr(n) + ' ' + (n === 1 ? 'محاولة' : 'محاولات');
  }

  onInput(event: Event) {
    this.guessValue.set((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.checkGuess();
  }

  checkGuess() {
    if (this.over() || !this.isValid()) return;
    const v = this.guessValue().trim();
    const hints = this.svc.getHints(v, this.config().secret);
    const entry: GuessEntry = { num: this.history().length + 1, guess: v, hints };
    this.history.update(h => [entry, ...h]);
    if (hints.every(h => h === 'correct')) {
      this.over.set(true);
    } else {
      this.guessValue.set('');
    }
  }

  onNewGame() {
    this.newGame.emit();
  }
}
