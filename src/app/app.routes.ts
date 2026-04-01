import { Routes } from '@angular/router';
import { Landing} from './features/landing/landing';
import { Game } from './features/game/game';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'game', component: Game },
];