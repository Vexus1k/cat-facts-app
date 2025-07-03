import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap, from, of, catchError, take, toArray, filter } from 'rxjs';

export interface CatFactResponse {
  data: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CatFactsService {
  private readonly _apiUrl = 'https://meowfacts.herokuapp.com/';
  private readonly _loadedFacts: Set<string> = new Set();

  constructor(private readonly _http: HttpClient) {}

  public getRandomFact(): Observable<string | null> {
    return this._http.get<CatFactResponse>(this._apiUrl).pipe(
      map(response => {
        const fact = response.data[0];

        if (this._loadedFacts.has(fact)) {
          return null;
        }

        this._loadedFacts.add(fact);
        return fact;
      }),
      catchError(error => {
        console.error('Error fetching cat fact:', error);
        return of(null);
      })
    );
  }

  public getMultipleFacts(count: number): Observable<string[]> {
    return from(Array.from({ length: Math.min(count, 5) }, (_, i) => i)).pipe(
      mergeMap(() => this.getRandomFact()),
      filter((fact): fact is string => fact !== null),
      take(count),
      toArray(),
      map(facts => facts.length > 0 ? facts : ['No unique cat facts available. Please try again.'])
    );
  }
}
