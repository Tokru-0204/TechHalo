import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { ChatMessage } from '../../common/ChatMessage';
import { District } from '../../common/District';
import { Notification } from '../../common/Notification';
import { Order } from '../../common/Order';
import { Province } from '../../common/Province';
import { Ward } from '../../common/Ward';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { OrderService } from '../../services/order.service';
import { ProvinceService } from '../../services/province.service';
import { SessionService } from '../../services/session.service';
import { WebSocketService } from '../../services/web-socket.service';
import { PromotionCodeService } from '../../services/promotions.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  discount!: number;
  amount!: number;
  amountReal!: number;
  discountCart!: number;

  postForm: FormGroup;

  provinces!: Province[];
  districts!: District[];
  wards!: Ward[];

  usedPromotionIds: number[] = []; // Mã giảm giá cho sản phẩm
  sharedPromotionIds: number[] = []; // Mã giảm giá dùng chung cho giỏ hàng

  province!: Province;
  district!: District;
  ward!: Ward;

  amountPaypal !:number;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;
  public payPalConfig ? : IPayPalConfig;
  public paymentMethod: 'COD' | 'PayPal' = 'COD';  // Mặc định là thanh toán khi nhận hàng (COD)


  constructor(
    private cartService: CartService,
    private promotionService: PromotionCodeService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private orderService: OrderService,
    private location: ProvinceService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService) {
    this.postForm = new FormGroup({
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'province': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'number': new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {

  // Lấy danh sách ID mã giảm giá dùng chung từ sessionStorage
  const storedSharedPromotionIds = sessionStorage.getItem('sharedPromotionIds');
  this.sharedPromotionIds = storedSharedPromotionIds ? JSON.parse(storedSharedPromotionIds) : [];

   // Retrieve values from session storage and ensure they are valid JSON or set to 0 if undefined
  const storedAmount = sessionStorage.getItem('checkoutAmount');
  const storedDiscount = sessionStorage.getItem('checkoutDiscount');
  const storedDiscountCart = sessionStorage.getItem('checkoutDiscountCart');
  const storedAmountReal = sessionStorage.getItem('checkoutAmountReal');

  // Parse only if the value is not null or undefined, else default to 0
  this.amount = storedAmount && storedAmount !== "undefined" ? JSON.parse(storedAmount) : 0;
  this.discount = storedDiscount && storedDiscount !== "undefined" ? JSON.parse(storedDiscount) : 0;
  this.discountCart = storedDiscountCart && storedDiscountCart !== "undefined" ? JSON.parse(storedDiscountCart) : 0;
  this.amountReal = storedAmountReal && storedAmountReal !== "undefined" ? JSON.parse(storedAmountReal) : 0;

    this.checkOutPaypal();
    this.webSocketService.openWebSocket();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.amountPaypal = 0;
  
    this.getAllItem();
    this.getProvinces();
    
    console.log('fdfsfdsf',this.usedPromotionIds);
  }

  getAllItem() {  
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
  
      // Thiết lập lại giá trị cho form
      this.postForm = new FormGroup({
        'phone': new FormControl(this.cart.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
        'province': new FormControl(0, [Validators.required, Validators.min(1)]),
        'district': new FormControl(0, [Validators.required, Validators.min(1)]),
        'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
        'number': new FormControl('', Validators.required),
      });

      this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
      this.cartDetails = data as CartDetail[];
          // Duyệt qua từng cartDetail để kiểm tra và thêm promotionCodeId
      this.cartDetails.forEach(cartDetail => {
        if (cartDetail.promotionCode?.promotionCodeId ) {
        this.usedPromotionIds.push(cartDetail.promotionCode.promotionCodeId);
        }
      });
      console.log('usedPromotionIdstâtta',this.usedPromotionIds);
      this.usedPromotionIds.push(...this.sharedPromotionIds);
      console.log('usedPromotionIdstâtta',this.usedPromotionIds);
        this.cartService.setLength(this.cartDetails.length);
  
        this.amountPaypal = this.amount / 22727.5; // Chuyển đổi sang USD
      });
    });
  }

  removeUsedPromotions() {
    const email = this.sessionService.getUser(); // Lấy email từ session
    const promotionCodeIds = this.usedPromotionIds; // Danh sách mã giảm giá đã dùng
   
    this.promotionService.removeUsedPromotions(email, promotionCodeIds).subscribe(
      () => {
        console.log('Mã giảm giá đã được xóa và cập nhật thành công.');
        // Làm sạch danh sách usedPromotionIds
        this.usedPromotionIds = [];
        sessionStorage.setItem('usedPromotionIds', JSON.stringify(this.usedPromotionIds));
      },
      (error) => {
        console.error('Lỗi khi xóa mã giảm giá:', error);
      }
    );
    }
  
  

  checkOut() {
    if (this.postForm.valid) {
      Swal.fire({
        title: 'Bạn có muốn đặt đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đặt'
      }).then((result) => {
        if (result.isConfirmed) { // Proceed only if confirmed
          let email = this.sessionService.getUser();
          this.cartService.getCart(email).subscribe(data => {
            this.cart = data as Cart;
            this.cart.discountCart = this.discountCart;
            this.cart.address = `${this.postForm.value.number}, ${this.ward.name}, ${this.district.name}, ${this.province.name}`;
            this.cart.phone = this.postForm.value.phone;
  
            this.cartService.updateCart(email, this.cart).subscribe(data => {
              this.cart = data as Cart;
              if (this.paymentMethod === 'PayPal') {
              this.orderService.postcheckoutcardpayment(email, this.cart).subscribe(data => {
                this.removeUsedPromotions();
                let order: Order = data as Order;
                this.sendMessage(order.ordersId);
                Swal.fire(
                  'Thành công!',
                  'Chúc mừng bạn đã đặt hàng thành công.',
                  'success'
                );
                this.router.navigate(['/cart']);
              }, error => {
                this.toastr.error('Lỗi server', 'Hệ thống');
              });
            } else {
              // Phương thức thanh toán khác (COD hoặc các phương thức khác)
              this.orderService.postcheckout(email, this.cart).subscribe(data => {
                  this.removeUsedPromotions();
                  let order: Order = data as Order;
                  this.sendMessage(order.ordersId);
                  Swal.fire(
                      'Thành công!',
                      'Chúc mừng bạn đã đặt hàng thành công.',
                      'success'
                  );
                  this.router.navigate(['/cart']);
              }, error => {
                  this.toastr.error('Lỗi server', 'Hệ thống');
              });
          }
            }, error => {
              this.toastr.error('Lỗi server', 'Hệ thống');
            });
          }, error => {
            this.toastr.error('Lỗi server', 'Hệ thống');
          });
        } else {
          // If not confirmed, simply return and do nothing
          return;
        }
      });
    } else {
      this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
    }
  }
  

  sendMessage(id:number) {
    let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
    this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng ('+id+')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
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

  private checkOutPaypal(): void {

    this.payPalConfig = {
        currency: 'USD',
        clientId: 'AWFYMsUsLPYXOgGXi9CNLUkO3DWKVXYuDNDce22UsyzvpA47wEMlGFhwXB1Wv2fZ9Q-iUdDc5l13E8Yl',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value:String(this.amountPaypal.toFixed(2)),

                },

            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical',
            color: 'blue',
            size: 'small',
            shape: 'rect',
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            this.paymentMethod = 'PayPal';
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.checkOut();
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);

        },
    };
}

}
