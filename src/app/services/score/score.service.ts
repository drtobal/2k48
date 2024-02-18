import { Injectable } from '@angular/core';
import { BEST_SCORE_LS } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  getBestScore(): number {
    if (typeof window !== 'undefined') {
      const data = Number(window.localStorage.getItem(BEST_SCORE_LS));
      if (!isNaN(data)) {
        return data;
      }
    }
    return 0;
  }

  saveBestScore(score: number): void {
    if (typeof window !== 'undefined') {
      if (this.getBestScore() < score) {
        window.localStorage.setItem(BEST_SCORE_LS, score.toString());
      }
    }
  }
}
