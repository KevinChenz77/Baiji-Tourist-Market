import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  selector: 'app-header',
  host: { class: 'block sticky top-0 z-40 bg-surface border-b border-border' },
  templateUrl: './header.html',
})
export class Header {
  protected readonly mobileMenuOpen = signal(false);

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
