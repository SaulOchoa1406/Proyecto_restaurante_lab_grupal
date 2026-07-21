import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accesToken = localStorage.getItem("acces");

  // Verifica si hay un acces token, sino no hace nada
  if(!accesToken) {
    return next(req);
  }

  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accesToken}`
    }
  });

  return next(authRequest);
};
