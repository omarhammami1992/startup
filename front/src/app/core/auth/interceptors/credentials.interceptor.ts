import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@env/environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl) && !req.url.startsWith('/api')) {
    return next(req);
  }

  return next(req.clone({ withCredentials: true }));
};
