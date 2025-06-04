import { Component, OnInit, Renderer2,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None, // Tắt bao bọc CSS
})
export class AdminComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {

    // Thêm file CSS của Bootstrap 4
    const bootstrap4Css = this.renderer.createElement('link');
    bootstrap4Css.rel = 'stylesheet';
    bootstrap4Css.href = 'assets/css_admin/bootstrap.min.css'; // Sửa lại file chính xác
    this.renderer.appendChild(document.head, bootstrap4Css);
    // Thêm file JS của Bootstrap 4
    const bootstrap4Js = this.renderer.createElement('script');
    bootstrap4Js.src = 'assets/js_admin/bootstrap.bundle.min.js'; // Sử dụng file bundle
    bootstrap4Js.type = 'text/javascript';
    this.renderer.appendChild(document.body, bootstrap4Js);
    // Tạo một thẻ <link> để tải file CSS admin
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/sb-admin-2.min.css'; // Đường dẫn tới file CSS admin
    this.renderer.appendChild(document.head, link); // Thêm thẻ <link> vào <head>

    const script = this.renderer.createElement('script');
    script.src = 'assets/sb-admin-2.min.js'; // Đường dẫn chính xác tới file
    script.type = 'text/javascript';
    script.async = true;
    this.renderer.appendChild(document.body, script); // Thêm script vào <body>
    // Thêm file CSS cho Google Fonts
    const robotoFont = this.renderer.createElement('link');
    robotoFont.rel = 'stylesheet';
    robotoFont.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
    this.renderer.appendChild(document.head, robotoFont);


  }
  

}
