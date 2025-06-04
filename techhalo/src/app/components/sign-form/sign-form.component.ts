import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Customer } from '../../common/Customer';
import { Login } from '../../common/Login';
import { Register } from '../../common/Register';

import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { FavoritesService } from '../../services/favorites.service';
import { SendmailService } from '../../services/sendmail.service';
import { SessionService } from '../../services/session.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProvinceService } from '../../services/province.service';
import { Province } from '../../common/Province';
import { District } from '../../common/District';
import { Ward } from '../../common/Ward';

// Custom password strength validator
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Không có lỗi nếu không có giá trị
    }

    // Kiểm tra mật khẩu có đủ yêu cầu: ít nhất 1 chữ in hoa, chữ thường, số và ký tự đặc biệt
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return !valid ? { passwordStrength: 'Mật khẩu cần có ít nhất một chữ in hoa, một chữ thường, một số và một ký tự đặc biệt.' } : null;
  };
}

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.css']
})
export class SignFormComponent implements OnInit {

  provinces!: Province[];
  districts!: District[];
  wards!: Ward[];

  province!: Province;
  district!: District;
  ward!: Ward;

  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;

  login!: Login;
  register!: Register;
  show: boolean = false; // For password visibility toggle
  showPassword: boolean = false; // To toggle password visibility
  loginForm: FormGroup;
  registerForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string = '';
  otpcode!: any;
  otpVerified: boolean = false; // To check OTP verification
  otpRequested: boolean = false; // To check if OTP has been requested
  otpInvalid: boolean = false; // To show error if OTP is invalid
  otpControls: FormControl[] = []; // Array of FormControl for OTP
  otpValues: string[] = ['', '', '', '', '', ''];

  constructor(
    private sendMailService: SendmailService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService,
    private userService: CustomerService,
    private location: ProvinceService
  ) {
    // Initialize forms
    this.loginForm = new FormGroup({
      'email': new FormControl(null),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        passwordStrengthValidator()  // Áp dụng validator tùy chỉnh
      ])
    });

    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        passwordStrengthValidator() // Áp dụng validator tùy chỉnh
      ]),
      'confirmPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'gender': new FormControl(true, [Validators.required]),
      'status': new FormControl(true),
      'registerDate': new FormControl(new Date()),
      'image': new FormControl('https://res.cloudinary.com/techhalo/image/upload/v1730057021/techhalo/a53my55gy32u26aqkbyq.jpg'),
      'phone': new FormControl(null, [Validators.required, Validators.pattern('^(0)[0-9]{9}$')]),
      // 'address': new FormControl(null, [Validators.required])
      'province': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
    
    });

    // Initialize OTP fields
    for (let i = 0; i < 6; i++) {
      this.otpControls.push(new FormControl('', Validators.required));
    }
  }

  ngOnInit(): void {
    this.getProvinces();
    this.checkLogin();
  }
  getProvinces() {
    this.location.getAllProvinces().subscribe(data => {
      this.provinces = data as Province[];
    })
  }

  getDistricts() {
    this.location.getDistricts(this.provinceCode).subscribe(data => {
      this.province = data as Province;
      this.districts = this.province.districts;
    })
  }

  getWards() {
    this.location.getWards(this.districtCode).subscribe(data => {
      this.district = data as District;
      this.wards = this.district.wards;
    })
  }

  getWard() {
    this.location.getWard(this.wardCode).subscribe(data => {
      this.ward = data as Ward;
    })
  }

  setProvinceCode(code: any) {
    this.provinceCode = code.value;
    this.getDistricts();
  }

  setDistrictCode(code: any) {
    this.districtCode = code.value;
    this.getWards();
  }

  setWardCode(code: any) {
    this.wardCode = code.value;
    this.getWard();
  }


  moveToNext(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Nếu người dùng xóa số, ẩn thông báo lỗi
    if (value === '' && this.otpInvalid) {
      this.otpInvalid = false; // Ẩn lỗi khi có bất kỳ ô nhập OTP nào bị xóa
    }
  
    // Chuyển qua ô kế tiếp khi có 1 ký tự hoặc quay lại nếu nhấn Backspace
    if (value && index < this.otpControls.length - 1) {
        (document.getElementsByClassName('otp-input')[index + 1] as HTMLInputElement).focus();
    } else if (event.key === 'Backspace' && index > 0) {
        (document.getElementsByClassName('otp-input')[index - 1] as HTMLInputElement).focus();
    }
  }

  pasteOtp(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (pasteData.length === 6) {
      pasteData.split('').forEach((char, index) => {
        if (this.otpControls[index]) {
          this.otpControls[index].setValue(char); 
          this.maskOtp(index);
        }
      });  
      this.verifyOtp(); 
    } else {
      this.toastr.warning('Mã OTP phải có đúng 6 ký tự', 'Hệ thống');
    }
    event.preventDefault();
  }
  
  // Send OTP to the email
  // sendOtp() {
  //   this.otpRequested = true; // Mark OTP as requested
  //   this.sendMailService.sendMailOtp(this.registerForm.value.email).subscribe(data => {
  //     localStorage.setItem("otp", JSON.stringify(data)); // Store OTP as string
  //     this.toastr.success('Chúng tôi đã gửi mã OTP về email của bạn!', 'Hệ thống');
  //   }, error => {
  //     if (error.status === 404) {
  //       this.toastr.error('Email này đã tồn tại trên hệ thống!', 'Hệ thống');
  //     } else {
  //       this.toastr.warning('Hãy nhập đúng email!', 'Hệ thống');
  //     }
  //   });
  // }
  sendOtp() {
    const emailControl = this.registerForm.get('email');

    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched(); // Đánh dấu trường email để kích hoạt hiển thị lỗi
      this.toastr.warning('Vui lòng nhập địa chỉ email hợp lệ!', 'Hệ thống');
      return;
  }
    this.otpRequested = true; // Đánh dấu đã yêu cầu OTP
    this.sendMailService.sendMailOtp(emailControl.value).subscribe(
        (data) => {
            localStorage.setItem('otp', JSON.stringify(data)); // Lưu OTP vào localStorage
            this.toastr.success('Mã OTP đã được gửi đến email của bạn.', 'Hệ thống');
        },
        (error) => {
            if (error.status === 404) {
                this.toastr.error('Email này đã tồn tại trong hệ thống!', 'Hệ thống');
                this.otpRequested = false;
            } else {
                this.toastr.warning('Có lỗi xảy ra. Vui lòng thử lại!', 'Hệ thống');
            }
        }
    );
}

  verifyOtp() {
    const enteredOtp = this.otpControls.map(control => control.value).join('');
    const storedOtp = localStorage.getItem("otp") || ''; // Lấy OTP từ localStorage dưới dạng chuỗi
  
    // Nếu không có OTP nào được nhập, ẩn thông báo lỗi
    if (enteredOtp === '') {
      this.otpInvalid = false; // Ẩn lỗi khi không có gì được nhập
    }
  
    // Kiểm tra OTP
    if (enteredOtp === storedOtp) {
      this.otpVerified = true;
      this.otpInvalid = false;
      this.toastr.success('Xác thực OTP thành công!', 'Hệ thống');
    } else {
      this.otpInvalid = true;
      this.toastr.error('Mã OTP không chính xác!', 'Hệ thống');
    }
  }

  // Sign up user
  sign_up() {
    if (this.registerForm.invalid) {
      this.toastr.error('Hãy nhập đầy đủ thông tin!', 'Hệ thống');
      return;
    }
  
    // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.toastr.error('Mật khẩu và xác nhận mật khẩu không khớp!', 'Hệ thống');
      return;
    }
    // Lấy các thông tin từ form
    const address = `${this.ward?.name}, ${this.district?.name}, ${this.province?.name}`;

    // Tạo đối tượng đăng ký
    this.register = { 
      ...this.registerForm.value,  // Lấy tất cả giá trị từ form
      address: address             // Thêm địa chỉ vào đối tượng đăng ký
    };
    localStorage.removeItem("otp");
  
    this.authService.register(this.register).subscribe(data => {
      Swal.fire({
        icon: 'success',
        title: 'Đăng kí thành công!',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        this.switchToSignIn(); // Chuyển sang form đăng nhập sau khi đăng ký thành công
      }, 500);
    }, error => {
      this.toastr.error(error.message, 'Hệ thống');
    });
  }

 sign_in() {
    this.login = this.loginForm.value;

    this.authService.login(this.login).subscribe(
      data => {
        this.sessionService.saveToken(data.token);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        let userTemp: Customer;
        this.userService.getByEmail(String(this.sessionService.getUser())).subscribe(data => {
          userTemp = data as Customer;
          this.sessionService.saveRoles(userTemp.roles.map((role) => role.name));
          // Check if the user is an admin
          if (userTemp.roles.some(role => role.name === 'ROLE_ADMIN') || userTemp.roles.some(role => role.name === 'ROLE_EMPLOYEE')) {
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/admin']).then(() => {
              window.location.reload(); // Reload the page after redirecting to admin
            }); 
          } else {
            // Redirect to home for non-admin users
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/home']).then(() => {
              window.location.reload(); // Reload the page after redirecting to home
            });
          }
        });
      },
      error => {
        this.toastr.error('Sai Thông Tin Đăng Nhập', 'Hệ thống');
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          showConfirmButton: false,
          timer: 1500
        });
        this.isLoginFailed = true;
      }
    );
}


  // Check if the user is logged in
  checkLogin() {
    if (this.sessionService.getUser() != null) {
      this.router.navigate(['/home']);
      window.location.href = ('/');
    }
  }

  // Toggle password visibility
  toggle() {
    this.show = !this.show;
  }
  toggle2() {
    this.show = !this.show;
  }

  // Switch to sign-up form
  switchToSignUp() {
    document.getElementById("sign-in")?.classList.remove("active");
    document.getElementById("sign-up")?.classList.add("active");
  }

  // Switch to sign-in form and reset OTP and register form
  switchToSignIn() {
    document.getElementById("sign-up")?.classList.remove("active");
    document.getElementById("sign-in")?.classList.add("active");
    this.registerForm.reset(); // Reset the registration form
    this.otpRequested = false;
    this.otpVerified = false;
  }

  // Mask OTP input field after entering
  maskOtp(index: number) {
    const control = this.otpControls[index];
    this.otpValues[index] = control.value;
    if (control.value) {
      setTimeout(() => {
        control.setValue('•'); 
      }, 100);
    }
  }
}
