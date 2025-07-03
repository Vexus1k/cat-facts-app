import { Component, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatFactsService } from '../../services/cat-facts.service';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cat-facts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-facts.component.html',
  styleUrls: ['./cat-facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatFactsComponent implements OnInit, OnDestroy {
  public facts = signal<string[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  public isAuthenticated$ = this._authService.isAuthenticated$;

  private isNearBottom = false;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _catFactsService: CatFactsService,
    private readonly _authService: AuthService,
    public readonly _router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialFacts();
  }

  public trackByFact(index: number, fact: string): string {
    return fact;
  }

  public loadInitialFacts(): void {
    this.loading.set(true);
    this.error.set(null);

    this._catFactsService.getMultipleFacts(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (facts) => {
          this.facts.set(facts);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load cat facts. Please try again later.');
          this.loading.set(false);
          console.error('Error loading cat facts:', err);
        }
      });
  }

  public loadMoreFacts(): void {
    this.loading.set(true);

    this._catFactsService.getMultipleFacts(3)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (facts) => {
          this.facts.update(currentFacts => [...currentFacts, ...facts]);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load more cat facts. Please try again later.');
          this.loading.set(false);
          console.error('Error loading more cat facts:', err);
        }
      });
  }

  public logout(): void {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    this.isNearBottom = (windowHeight + scrollTop + 200 >= documentHeight);

    if (this.isNearBottom && !this.loading()) {
      this.loadMoreFacts();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
