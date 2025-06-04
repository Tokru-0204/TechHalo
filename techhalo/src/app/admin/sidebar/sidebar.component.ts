import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services_admin/page.service';
import { SessionService } from '../../services_admin/session.service';
import { AuthService } from 'src/app/services_admin/auth.service';
@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent_Admin implements OnInit {
  pageActive!: string;
  email!: string;
  role: string = 'Loading...';
  constructor(private pageService: PageService, private sessionService: SessionService, private userService: AuthService) {}

  ngOnInit(): void {
    this.pageService.$dataPageActive.subscribe(data => {
      this.pageActive = data;
    });
    // Lấy email từ session
    this.email = this.sessionService.getUser() || 'Unknown User';

    if (this.email) {
      this.userService.getRoleByEmail(this.email).subscribe(
        role => {
          this.role = role; // Gán vai trò từ JSON trả về
        },
        error => {
          console.error('Không thể lấy vai trò:', error);
          this.role = 'Unknown Role'; // Vai trò mặc định nếu có lỗi
        }
      );
    } 
  }
  isRoleAllowed(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.role);
  }

  setPage(page: string) {
    this.pageService.setPageActive(page);
  }
}
