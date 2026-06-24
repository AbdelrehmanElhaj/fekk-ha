import { Component, signal } from '@angular/core';
import { SetupComponent } from './setup/setup';
import { GameComponent } from './game/game';
import { GameConfig } from './game.service';

@Component({
  selector: 'app-root',
  imports: [SetupComponent, GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  screen = signal<'setup' | 'game'>('setup');
  config = signal<GameConfig | null>(null);

  onStart(cfg: GameConfig) {
    this.config.set(cfg);
    this.screen.set('game');
  }

  onNewGame() {
    this.screen.set('setup');
  }
}
