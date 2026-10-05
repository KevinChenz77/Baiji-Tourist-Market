import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-market-about',
  imports: [RouterLink, MatIconModule],
  templateUrl: './market-about.html',
  styleUrl: './market-about.scss',
})
export class MarketAbout {}
