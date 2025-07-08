import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importa Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Importa isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  // Inicializa loggedIn con el valor de hasToken(), pero solo si estamos en el navegador
  private loggedIn: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyecta PLATFORM_ID
  ) {
    // Solo intenta acceder a localStorage si estamos en el navegador
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) { // Comprueba si estamos en el navegador
      return !!localStorage.getItem('accessToken');
    }
    return false; // Si no es un navegador, no hay token
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(credentials: any): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) { // Solo guarda en localStorage si estamos en el navegador
          localStorage.setItem('accessToken', response.accessToken);
        }
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) { // Solo elimina de localStorage si estamos en el navegador
      localStorage.removeItem('accessToken');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { // Solo obtiene de localStorage si estamos en el navegador
      return localStorage.getItem('accessToken');
    }
    return null; // Si no es un navegador, no hay token
  }
}