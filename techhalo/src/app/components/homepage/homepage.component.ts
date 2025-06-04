import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { Customer } from '../../common/Customer';
import { Favorites } from '../../common/Favorites';
import { Product } from '../../common/Product';
import { Rate } from '../../common/Rate';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { FavoritesService } from '../../services/favorites.service';
import { ProductService } from '../../services/product.service';
import { RateService } from '../../services/rate.service';
import { SessionService } from '../../services/session.service';
import { Supplier } from 'src/app/common/Supplier';
import { SupplierService } from 'src/app/services_admin/supplier.service';
// import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @ViewChild('myVideo', { static: true }) myVideo: ElementRef<HTMLVideoElement> | undefined;

  videoUrls: string[] = [
    'https://res.cloudinary.com/techhalo/video/upload/v1732631809/techhalo/eavxmbvmhgcgllpuxpel.mp4',
    'https://res.cloudinary.com/techhalo/video/upload/v1732631810/techhalo/vfaw6jsiwpttow7udh4b.mp4',
    'https://res.cloudinary.com/techhalo/video/upload/v1732631810/techhalo/qul43txhisjzwdeulv6j.mp4',
    'https://res.cloudinary.com/techhalo/video/upload/v1732631810/techhalo/adqyvmulgrz5jmj952jo.mp4',
    'https://res.cloudinary.com/techhalo/video/upload/v1732631811/techhalo/tyycepummig45h5ajqnj.mp4',
    'https://res.cloudinary.com/techhalo/video/upload/v1732631812/techhalo/zfznri6jcfeawdgqe6iq.mp4'
  ];
  currentVideoIndex: number = 0;

  productSeller!:Product[];
  productLatest!:Product[];
  productRated!:Product[];
  suppliers!: Supplier[];
  productSupplier!: Product[];

  isLoading = true;

  customer!: Customer;
  favorite!: Favorites;
  favorites!: Favorites[];

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  
  rates!: Rate[];
  countRate!: number;

  slideConfigWithoutArrows = {
    slidesToShow: 7,
    slidesToScroll: 1,
    dots: true,
    arrows: false, // Disable arrows
    infinite: true,
    responsive: [
      {
          breakpoint: 1024,
          settings: {
              slidesToShow: 3, // Tablet
              slidesToScroll: 1,
          }
      },
      {
          breakpoint: 768,
          settings: {
              slidesToShow: 3, // Điện thoại lớn
              slidesToScroll: 1,
          }
      },
      {
          breakpoint: 576,
          settings: {
              slidesToShow: 2, // Điện thoại nhỏ
              slidesToScroll: 1,
          }
      }
  ]
  };
  slideConfig = {
    infinite: true,
    slidesToShow: 7, // Số lượng sản phẩm hiển thị trên desktop
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3, // Tablet
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3, // Điện thoại lớn
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 2, // Điện thoại nhỏ
                slidesToScroll: 1,
            }
        }
    ]
};


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private customerService: CustomerService,
    private rateService: RateService,
    private supplierService: SupplierService,
    private toastr: ToastrService,
    private favoriteService: FavoritesService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.playInitialVideo(); // Phát video đầu tiên khi tải trang
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getAllProductBestSeller();
    this.getAllProductLatest();
    this.getAllProductRated();
    this.getAllRate();
    this.getAllSuppliers();
  }

  // Phát video đầu tiên
 playInitialVideo(): void {
  const videoElement = this.myVideo?.nativeElement;
  if (videoElement) {
    videoElement.src = this.videoUrls[this.currentVideoIndex]; // Gán URL video đầu tiên
    videoElement.load(); // Tải video
    videoElement.muted = true; // Đảm bảo không tắt âm thanh
    videoElement.volume = 0.05; // Giảm âm lượng (0.2 = 20% âm lượng)
    // videoElement.muted = false; // Tắt âm thanh để tránh lỗi autoplay
    videoElement.play().catch((error) => {
      console.error('Video autoplay bị chặn:', error);
    });
  }
}

onVideoEnded(): void {
  if (this.currentVideoIndex < this.videoUrls.length - 1) {
    this.currentVideoIndex++; // Chuyển đến video kế tiếp
  } else {
    this.currentVideoIndex = 0; // Quay về video đầu tiên nếu đã hết danh sách
  }
  this.loadAndPlayVideo();
}

// Chuyển đến video trước
prevVideo(): void {
  if (this.currentVideoIndex === 0) {
    this.currentVideoIndex = this.videoUrls.length - 1; // Quay lại video cuối
  } else {
    this.currentVideoIndex--; // Lùi lại 1 video
  }
  this.loadAndPlayVideo();
}

// Chuyển đến video tiếp theo
nextVideo(): void {
  if (this.currentVideoIndex === this.videoUrls.length - 1) {
    this.currentVideoIndex = 0; // Quay lại video đầu tiên
  } else {
    this.currentVideoIndex++; // Tiến thêm 1 video
  }
  this.loadAndPlayVideo();
}

// Tải và phát video
loadAndPlayVideo(): void {
  const videoElement = this.myVideo?.nativeElement;
  if (videoElement) {
    videoElement.src = this.videoUrls[this.currentVideoIndex];
    videoElement.load();
    videoElement.muted = true; // Bật âm thanh
    videoElement.volume = 0.05; // Giảm âm lượng (0.2 = 20% âm lượng)
    videoElement.play().catch((error) => {
      console.error('Lỗi phát video:', error);
    });
  }
}

  getAllRate() {
    this.rateService.getAll().subscribe(data => {
      this.rates = data as Rate[];
    })
  }

  getAvgRate(id: number): number {
    let avgRating: number = 0;
    this.countRate = 0;
    for (const item of this.rates) {
      if (item.product.productId === id) {
        avgRating += item.rating;
        this.countRate++;
      }
    }
    return Math.round(avgRating/this.countRate * 10) / 10;
  }

  getAllProductBestSeller() {
    this.productService.getBestSeller().subscribe(data=>{
      this.productSeller = data as Product[];
      this.isLoading = false;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')   
      console.log(error);   
    })
  }

  getAllProductLatest() {
    this.productService.getLasted().subscribe(data=>{
      this.productLatest = data as Product[];
      this.isLoading = false;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')  
      console.log(error);    
    })
  }

  getAllProductRated() {
    this.productService.getRated().subscribe(data=>{
      this.productRated = data as Product[];
      this.isLoading = false;
    }, error=>{
      this.toastr.error('Lỗi server!', 'Hệ thống')   
      console.log(error);
         
    })
  }

  toggleLike(id: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }
    this.favoriteService.getByProductIdAndEmail(id, email).subscribe(data => {      
      if (data == null) {
        this.customerService.getByEmail(email).subscribe(data => {
          this.customer = data as Customer;
          this.favoriteService.post(new Favorites(0, new Customer(this.customer.userId), new Product(id))).subscribe(data => {
            this.toastr.success('Thêm thành công!', 'Hệ thống');
            this.favoriteService.getByEmail(email).subscribe(data=>{
              this.favorites = data as Favorites[];
              this.favoriteService.setLength(this.favorites.length);
            }, error=>{
              this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
            })
          }, error => {
            this.toastr.error('Thêm thất bại!', 'Hệ thống');
          })
        })
      } else {
        this.favorite = data as Favorites;
        this.favoriteService.delete(this.favorite.favoriteId).subscribe(data => {
          this.toastr.info('Đã xoá ra khỏi danh sách yêu thích!', 'Hệ thống');
          this.favoriteService.getByEmail(email).subscribe(data=>{
            this.favorites = data as Favorites[];
            this.favoriteService.setLength(this.favorites.length);
          }, error=>{
            this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
          })
        }, error => {
          this.toastr.error('Lỗi!', 'Hệ thống');
        })
      }
    })
  }

  addCart(productId: number, price: number) {
    let email = this.sessionService.getUser();
    if (email == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info('Hãy đăng nhập để sử dụng dịch vụ của chúng tôi', 'Hệ thống');
      return;
    }
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.cartDetail = new CartDetail(0, 1, price, new Product(productId), new Cart(this.cart.cartId));
      this.cartService.postDetail(this.cartDetail).subscribe(data => {
        this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
        this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
          this.cartDetails = data as CartDetail[];
          this.cartService.setLength(this.cartDetails.length);
        })
      }, error => {
        this.toastr.error('Sản phẩm này có thể đã hết hàng!', 'Hệ thống');
        this.router.navigate(['/home']);
        window.location.href = "/";
      })
    })
  }
  getAllSuppliers(): void {
    this.supplierService.getAllSup().subscribe(
      (data) => {
        this.suppliers = data as Supplier[];
      },
      (error) => {
        this.toastr.error('Lỗi khi tải danh sách nhà cung cấp!', 'Hệ thống');
        console.error(error);
      }
    );
  }
  getProductsBySupplier(supplierId: number): void {
    this.productService.getProductsByCompany(supplierId).subscribe(
      (data) => {
        this.productSupplier = data as Product[];
      },
      (error) => {
        this.toastr.error('Lỗi khi tải sản phẩm của nhà cung cấp!', 'Hệ thống');
        console.error(error);
      }
    );
  }
  
  

}
