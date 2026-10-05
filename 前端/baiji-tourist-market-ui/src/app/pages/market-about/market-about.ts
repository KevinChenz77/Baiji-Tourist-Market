import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { setPageMeta } from '../../shared/seo';

@Component({
  selector: 'app-market-about',
  imports: [RouterLink, MatIconModule],
  templateUrl: './market-about.html',
  styleUrl: './market-about.scss',
})
export class MarketAbout {
  constructor() {
    setPageMeta(
      '商場簡介與沿革｜三峽白雞觀光商場',
      '認識三峽白雞觀光商場的簡介、沿革與營業資訊。',
      'market/about'
    );
  }
}
