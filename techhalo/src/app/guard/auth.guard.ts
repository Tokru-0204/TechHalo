import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data['roles'] as string[]; // Vai trò yêu cầu từ route metadata

    if (this.sessionService.getToken()) {
      // Kiểm tra quyền truy cập
      if (roles && roles.length > 0) {
        if (roles.some((role) => this.sessionService.hasRole(role))) {
          console.log('Role is allowed', roles);
          return true; // Người dùng có quyền truy cập
        } else {
          this.router.navigate(['/not-authorized']); // Chuyển đến trang lỗi quyền truy cập
          return false;
        }
      }
      return true; // Nếu không yêu cầu vai trò, cho phép truy cập
    }

    this.router.navigate(['/sign-form']); // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
    return false;
  }
}
