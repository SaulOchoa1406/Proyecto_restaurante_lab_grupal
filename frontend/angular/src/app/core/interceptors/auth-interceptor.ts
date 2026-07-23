import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem("access");

  // Verifica si hay un acces token, sino no hace nada
  if(!accessToken) {
    return next(req);
  }

  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authRequest);
};
