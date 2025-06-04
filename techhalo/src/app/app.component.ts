import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeaderFooter: boolean = true;
  showZaloChat: boolean = true; // Điều khiển hiển thị widget Zalo
  title = 'techhalo';
  constructor(private router: Router) {
    // Lắng nghe thay đổi route để kiểm tra
    this.router.events.subscribe(() => {
      // Kiểm tra nếu route chứa `/admin`, ẩn header/footer
      this.showHeaderFooter = !this.router.url.startsWith('/admin');
      this.showZaloChat = !this.router.url.startsWith('/admin');
    });
  }
  ngOnInit() {
    // Thêm JavaScript để thay đổi meta viewport khi tải trang
    this.setViewportScale();
    // Chỉ tải SDK khi ứng dụng chạy
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js';
    script.async = true;
    document.body.appendChild(script);
  }
   // Hàm này thay đổi thẻ meta viewport khi trang tải
   setViewportScale() {
    const metaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (metaTag) {
      metaTag.setAttribute('content', 'width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=no');
    }
  }
}
