import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { API_URL } from './config';
import { apiError } from './notice.service';
describe('API authentication boundaries', () => {
  let http: HttpClient, controller: HttpTestingController, auth: AuthService;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });
  afterEach(() => {
    controller.verify();
    auth.clear();
  });
  it('keeps authentication and discovery requests public even when a token is stored', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'test-token');
    for (const path of [
      '/register',
      '/login',
      '/all-recipes',
      '/all-testimony',
      '/get-approved-testimony',
    ]) {
      http.get(API_URL + path).subscribe();
      const req = controller.expectOne(API_URL + path);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    }
  });
  it('sends the current Bearer token to a protected API endpoint', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'test-token');
    http.get(API_URL + '/get-save-recipes').subscribe();
    const req = controller.expectOne(API_URL + '/get-save-recipes');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush([]);
  });
  it('never leaks the token to another origin', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'test-token');
    http.get('https://unrelated.example/image').subscribe();
    const req = controller.expectOne('https://unrelated.example/image');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
  it('clears an expired protected session and redirects to login', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'expired-token');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    http.get(API_URL + '/get-save-recipes').subscribe({ error: () => {} });
    controller
      .expectOne(API_URL + '/get-save-recipes')
      .flush(
        { message: 'Session expired' },
        { status: 401, statusText: 'Unauthorized' },
      );
    expect(auth.signedIn).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  });
  it('does not discard an existing session for a login error', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'existing');
    http.post(API_URL + '/login', {}).subscribe({ error: () => {} });
    controller
      .expectOne(API_URL + '/login')
      .flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' },
      );
    expect(auth.token).toBe('existing');
  });
  it('removes only CookPedia session data on logout', () => {
    auth.setSession({ username: 'Test', role: 'User' }, 'test-token');
    sessionStorage.setItem('unrelated', 'keep');
    auth.clear();
    expect(auth.token).toBeNull();
    expect(auth.user()).toBeNull();
    expect(sessionStorage.getItem('unrelated')).toBe('keep');
    sessionStorage.removeItem('unrelated');
  });
  it('turns upstream HTML errors into readable feedback', () => {
    expect(
      apiError({
        status: 500,
        error: '<!DOCTYPE html><pre>Internal Server Error</pre>',
      }),
    ).not.toContain('<');
    expect(
      apiError({ status: 503, error: { message: 'Database unavailable' } }),
    ).toBe('Database unavailable');
  });
});
