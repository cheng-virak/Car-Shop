import { Component, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

type Theme = 'dark' | 'light';

interface Car {
  featured?: boolean;
  type: string;
  emoji: string;
  badge: string;
  badgeClass: 'badge-new' | 'badge-used' | 'badge-hot';
  make: string;
  model: string;
  year: number;
  category: string;
  price: string;
  hp: string;
  fuel: string;
  cta: string;
}

interface Filter {
  key: string;
  label: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('dark');
  readonly activeFilter = signal<string>('all');

  readonly filters: Filter[] = [
    { key: 'all', label: 'All Models' },
    { key: 'new', label: 'New' },
    { key: 'used', label: 'Pre-owned' },
    { key: 'suv', label: 'SUV' },
    { key: 'sedan', label: 'Sedan' },
    { key: 'electric', label: 'Electric' },
    { key: 'sport', label: 'Sport' },
  ];

  readonly cars: Car[] = [
    { featured: true, type: 'sport new', emoji: '🏎️', badge: "Editor's Pick", badgeClass: 'badge-hot', make: 'Porsche', model: '911 Carrera S', year: 2026, category: 'Sport', price: '$142,500', hp: '450 hp', fuel: 'Petrol', cta: 'Configure' },
    { type: 'electric new', emoji: '🚗', badge: 'New', badgeClass: 'badge-new', make: 'Tesla', model: 'Model S Plaid', year: 2026, category: 'Electric', price: '$108,990', hp: '1,020 hp', fuel: 'Electric', cta: 'Configure' },
    { type: 'suv new', emoji: '🚙', badge: 'New', badgeClass: 'badge-new', make: 'BMW', model: 'X7 M60i', year: 2026, category: 'SUV', price: '$98,500', hp: '530 hp', fuel: 'Petrol', cta: 'Configure' },
    { type: 'sedan used', emoji: '🚘', badge: 'Pre-owned', badgeClass: 'badge-used', make: 'Mercedes-Benz', model: 'E-Class 350', year: 2023, category: 'Sedan', price: '$61,200', hp: '295 hp', fuel: 'Hybrid', cta: 'View Details' },
    { type: 'electric new', emoji: '🚗', badge: 'New', badgeClass: 'badge-new', make: 'Audi', model: 'e-tron GT RS', year: 2026, category: 'Electric', price: '$145,900', hp: '630 hp', fuel: 'Electric', cta: 'Configure' },
    { type: 'suv used', emoji: '🚙', badge: 'Pre-owned', badgeClass: 'badge-used', make: 'Range Rover', model: 'Sport HSE', year: 2024, category: 'SUV', price: '$87,400', hp: '350 hp', fuel: 'Diesel', cta: 'View Details' },
  ];

  readonly visibleCount = computed(() =>
    this.cars.filter(c => this.isVisible(c.type)).length
  );

  constructor() {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem('apex-theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme.set(saved ?? (prefersDark ? 'dark' : 'light'));
      } catch {}
    }

    effect(() => {
      const t = this.theme();
      this.doc.documentElement.setAttribute('data-theme', t);
      if (this.isBrowser) {
        try { localStorage.setItem('apex-theme', t); } catch {}
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setFilter(key: string): void {
    this.activeFilter.set(key);
  }

  isVisible(carType: string): boolean {
    const f = this.activeFilter();
    return f === 'all' || carType.includes(f);
  }
}
