import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product!: Product;
  products!: Product[];
  filteredRates: any[] = [];  // Danh sách đánh giá đã lọc theo sản phẩm hiện tại
  searchKeyword: string = '';
  previousId: number | null = null; // Lưu ID của sản phẩm trước đó
  similarProduct: Product | null = null;
  id!: number;
  currentImage!: string;
  selectedThumbnailIndex: number = 0; // Holds the index of the currently selected thumbnail
  

  isLoading = true;
  isLiked: boolean = false;

  customer!: Customer;
  favorite!: Favorites;
  favorites!: Favorites[];
  totalLike!: number;

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  rates:Rate[] = [];
  rateAll!:Rate[];
  countRate!:number;
  a : String="Không có sản phẩm tương tự!";

  itemsComment:number = 3;
  slideConfig = {
    infinite: true,
    slidesToShow: 7, // Số lượng sản phẩm hiển thị trên desktop
    slidesToScroll: 2,
    autoplay: true,
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
    private modalService: NgbModal,
    private cartService: CartService, 
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService, 
    private favoriteService: FavoritesService,
    private sessionService: SessionService,
    private rateService: RateService) {
    route.params.subscribe(val => {
      this.ngOnInit();
    })
  }

  // slideConfig = {"slidesToShow": 7, "slidesToScroll": 2, "autoplay": true};

  ngOnInit(): void {
    this.modalService.dismissAll();
    this.id = this.route.snapshot.params['id'];
    this.getProduct();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.getAllRate();
    this.getRates();
    this.getTotalLike();
    this.getSimilarProducts(this.searchKeyword);
 

    console.log("đấ",this.filteredRates);
  }

  setItemsComment(size: number) {
    this.getProduct();
    this.getAllRate();
    this.getRates();
    this.getTotalLike();
    this.itemsComment = size;
    console.log(this.itemsComment);
    
    
  }

  getProduct() {
    const defaultImageUrl = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
  
    this.productService.getOne(this.id).subscribe(data => {
      this.isLoading = false;
      this.product = data as Product;
  
      // Check and set default image if any image field is null
      if (!this.product.image) {
        this.product.image = defaultImageUrl;
      }
      if (!this.product.image2) {
        this.product.image2 = defaultImageUrl;
      }
      if (!this.product.image3) {
        this.product.image3 = defaultImageUrl;
      }
      if (!this.product.image4) {
        this.product.image4 = defaultImageUrl;
      }
      if (!this.product.image5) {
        this.product.image5 = defaultImageUrl;
      }
       const searchKeyword = this.getProductNameForSearch(this.product.name);
       this.getSimilarProducts(searchKeyword); 
      this.currentImage = this.product.image;

      const name = this.product.name.trim(); 
      const indexOfSlash = name.indexOf('/'); 

      if (indexOfSlash !== -1) {
        this.product.normalPart = name.substring(0, indexOfSlash).trim();
             const lastSpaceIndex = this.product.normalPart.lastIndexOf(' '); 
        this.product.normalPart = name.substring(0, lastSpaceIndex).trim(); 
        
        this.product.styledPart = name.substring(lastSpaceIndex).trim(); 
      } else {
        this.product.normalPart = name;
        this.product.styledPart = '';
      }
      this.productService.getSuggest(this.product.category.categoryId, this.product.productId).subscribe(data => {
        this.products = data as Product[];

      });
    }, error => {
      this.toastr.error('Sản phẩm không tồn tại!', 'Hệ thống');
      this.router.navigate(['/home']);
    });
  }

  changeImage(newImageUrl: string, index: number) {
    this.currentImage = newImageUrl;
    this.selectedThumbnailIndex = index; // Update the index of the selected image
  }

  getRates() {
    this.rateService.getByProduct(this.id).subscribe(data=>{
      this.rates = data as Rate[];
    }, error=>{
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    })
  }

  getAllRate(): void {
    this.rateService.getAll().subscribe(
      (data) => {
        // Đảm bảo rates là mảng
        this.rates = Array.isArray(data) ? (data as Rate[]) : [];
        
        // Lọc các đánh giá cho sản phẩm hiện tại
        this.filteredRates = this.rates.filter(rate => rate.product.productId === this.product.productId);
      
      },
      (error) => {
        this.toastr.error('Lỗi khi tải đánh giá!', 'Hệ thống');
      }
    );
  }
  

  getAvgRate(id: number): number {
    if (!Array.isArray(this.rates) || this.rates.length === 0) {
      return 0; // Trả về 0 nếu rates chưa có dữ liệu
    }
  
    let avgRating = 0;
    this.countRate = 0;
  
    for (const item of this.rates) {
      if (item.product.productId === id) {
        avgRating += item.rating;
        this.countRate++;
      }
    }
  
    return this.countRate > 0
      ? Math.round((avgRating / this.countRate) * 10) / 10
      : 0; // Trả về trung bình hoặc 0 nếu không có đánh giá
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
              this.isLiked = true; // Cập nhật trạng thái yêu thích
              this.totalLike++;    // Tăng số lượng lượt thích
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
            this.isLiked = false; // Cập nhật trạng thái yêu thích
            this.totalLike--;     // Giảm số lượng lượt thích
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


  getTotalLike() {
    this.favoriteService.getByProduct(this.id).subscribe(data => {
      this.totalLike = data as number;
      let email = this.sessionService.getUser();
      if (email != null) {
        this.favoriteService.getByProductIdAndEmail(this.id, email).subscribe(data => {
          this.isLiked = data != null; // Nếu có dữ liệu thì sản phẩm đã được thích
        });
      }
    });
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

  //26/11
  getSimilarProducts(productName: string): void {
    this.productService.getByKeyword(productName, this.id).subscribe(data => {
      this.products = data as Product[];
      // Lấy sản phẩm tương tự đầu tiên
      if (this.products.length > 0) {
        this.similarProduct = this.products[0];
      } else {
        this.similarProduct = null;
        // this.toastr.info('Không có sản phẩm tương tự!', 'Hệ thống');
      }
    }, error => {
      this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    });
  }
  
  
  
  getProductNameForSearch(productName: string): string {
    if (!productName) return ''; // Trường hợp tên sản phẩm trống
    const parts = productName.trim().split(' '); // Tách chuỗi theo dấu "/"
    // Lấy 3 phần đầu tiên khoảng trắng và nối lại
    return parts.slice(0, 3).join(' ');
  }
  
  
}
