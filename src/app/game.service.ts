import { Injectable } from '@angular/core';

export type HintType = 'correct' | 'wrong-pos' | 'absent';

export interface GameConfig {
  mode: 'vs' | 'ai';
  len: 2 | 3;
  secret: string;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  toAr(n: number): string {
    return String(n).split('').map(d => this.arabicNums[+d]).join('');
  }

  hasDup(arr: (string | number)[]): boolean {
    return new Set(arr.map(String)).size !== arr.length;
  }

  genRandom(n: number): string {
    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const res: number[] = [];
    while (res.length < n) {
      const i = Math.floor(Math.random() * pool.length);
      res.push(pool.splice(i, 1)[0]);
    }
    return res.join('');
  }

  getHints(guess: string, secret: string): HintType[] {
    return guess.split('').map((ch, i) => {
      if (ch === secret[i]) return 'correct';
      if (secret.includes(ch)) return 'wrong-pos';
      return 'absent';
    });
  }
}
