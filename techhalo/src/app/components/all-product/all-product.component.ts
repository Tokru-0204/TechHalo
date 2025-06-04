  import { Component, OnInit } from '@angular/core';
  import { NavigationEnd, Router } from '@angular/router';
  import { ToastrService } from 'ngx-toastr';
  import { Cart } from '../../common/Cart';
  import { CartDetail } from '../../common/CartDetail';
  import { Category } from '../../common/Category';
  import { Customer } from '../../common/Customer';
  import { Favorites } from '../../common/Favorites';
  import { Product } from '../../common/Product';
  import { Supplier } from '../../common/Supplier';
  import { Rate } from '../../common/Rate';
  import { CartService } from '../../services/cart.service';
  import { CategoryService } from '../../services/category.service';
  import { CustomerService } from '../../services/customer.service';
  import { FavoritesService } from '../../services/favorites.service';
  import { ProductService } from '../../services/product.service';
  import { RateService } from '../../services/rate.service';
  import { SessionService } from '../../services/session.service';
  import { SupplierService } from '../../services_admin/supplier.service';

  @Component({
    selector: 'app-all-product',
    templateUrl: './all-product.component.html',
    styleUrls: ['./all-product.component.css']
  })
  export class AllProductComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    suppliers: Supplier[] = [];
    rams: string[] = [];
    storages: string[] = [];
    screenSizes: string[] = [];  
    vgas: string[] = [];
    cpus: string[] = [];


    rates: Rate[] = [];


    selectedCategories: number[] = [];
    selectedSupplier: number[] = [];
    selectedRam: string[] = [];
    selectedStorage: string[] = [];
    selectedScreens: string[] = [];
    selectedVgas: string[] = [];
    selectedCpus: string[] = [];


    isLoading: boolean = true;
    page: number = 1;
    countRate!: number;

    cart!: Cart;
    cartDetail!: CartDetail;
    customer!: Customer;
    cartDetails: CartDetail[] = [];
    favorites: Favorites[] = [];
    favorite!: Favorites;


    key: string = '';
    keyF: string = '';
    reverse: boolean = true;

     // Trạng thái hiển thị của các bộ lọc
    showCategories = false;
    showSuppliers = false;
    showRams = false;
    showStorages = false;
    showScreens = false;
    showVgas = false;
    showCpus = false;

    constructor(
      private productService: ProductService,
      private categoryService: CategoryService,
      private supplierService: SupplierService,
      private cartService: CartService,
      private customerService: CustomerService,
      private favoriteService: FavoritesService,
      private sessionService: SessionService,
      private rateService: RateService,
      private toastr: ToastrService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });

      this.getProducts();
      this.getCategories();
      this.getSuppliers();
      this.getAllRates();
    }

    getProducts(): void {
      this.productService.getAll().subscribe(
        (data) => {
          this.products = data as Product[];
          this.filteredProducts = [...this.products];
          this.extractFilters();
          this.isLoading = false;
        },
        (error) => this.toastr.error('Lỗi khi tải sản phẩm!', 'Hệ thống')
      );
    }

    getCategories(): void {
      this.categoryService.getAll().subscribe(
        (data) => (this.categories = data as Category[]),
        (error) => this.toastr.error('Lỗi khi tải danh mục!', 'Hệ thống')
      );
    }

    getSuppliers(): void {
      this.supplierService.getAllSup().subscribe(
        (data) => (this.suppliers = data as Supplier[]),
        (error) => this.toastr.error('Lỗi khi tải nhà cung cấp!', 'Hệ thống')
      );
    }

    getAllRates(): void {
      this.rateService.getAll().subscribe(
        (data) => (this.rates = data as Rate[]),
        (error) => this.toastr.error('Lỗi khi tải đánh giá!', 'Hệ thống')
      );
    }
    extractFilters(): void {
      const ramSet = new Set<string>();
      const storageSet = new Set<string>();
      const screenSet = new Set<string>();
      const vgaSet = new Set<string>();
      const cpuSet = new Set<string>();
    
      this.products.forEach((product) => {
        // Tách thông tin sau dấu "/"
        const parts = product.name.split('/');
    
        if (parts.length >= 5) {
               // 1. Cấu hình (CPU: lấy từ khoảng trắng cuối cùng đến dấu "/" đầu tiên)
      const cpu = parts[0].trim();
      const firstSlashIndex = product.name.indexOf('/');  // Tìm dấu "/" đầu tiên trong tên sản phẩm
      const lastSpaceIndex = cpu.lastIndexOf(' ');  // Tìm khoảng trắng cuối cùng trong phần trước dấu "/"
      
      // Lấy phần cấu hình từ khoảng trắng cuối cùng đến dấu "/" đầu tiên
      const cpuValue = cpu.substring(lastSpaceIndex + 1, firstSlashIndex).trim(); 

      if (cpuValue) cpuSet.add(cpuValue);

    
          // 2. RAM (12GB) - lấy từ phần sau dấu "/" đầu tiên đến "/" thứ hai
          const ram = parts[1]?.trim();
          if (ram && ram.includes('GB')) ramSet.add(ram);
    
          // 3. SSD (512GB) - lấy từ phần sau dấu "/" thứ hai đến "/" thứ ba
          const storage = parts[2]?.trim();
          if (storage && storage.includes('GB')) storageSet.add(storage);
    
          // 4. Màn hình (15.6inch) - lấy từ phần sau dấu "/" thứ ba đến "/" thứ tư
          const screen = parts[3]?.trim();
          if (screen && screen.includes('inch')) screenSet.add(screen);
    
          // 5. Card đồ họa (VGA 6GB hoặc RTX4050) - lấy phần sau dấu "/" thứ tư (nếu có)
          const vga = parts[4]?.trim();
          if (vga) vgaSet.add(vga);
        }
      });
    
      // Gán giá trị vào các thuộc tính
      this.cpus = Array.from(cpuSet);
      this.rams = Array.from(ramSet);
      this.storages = Array.from(storageSet);
      this.screenSizes = Array.from(screenSet);
      this.vgas = Array.from(vgaSet);
    }
    
    
    
    
    applyFilters(): void {
      this.filteredProducts = this.products.filter(product => {
        return (
          (this.selectedCategories.length === 0 || this.selectedCategories.includes(product.category.categoryId)) &&
          (this.selectedSupplier.length === 0 || this.selectedSupplier.includes(product.supplier?.supplierId)) &&
          (this.selectedRam.length === 0 || this.selectedRam.some((ram) => product.name.toLowerCase().includes(ram.toLowerCase()))) &&
          (this.selectedStorage.length === 0 || this.selectedStorage.some((storage) => product.name.toLowerCase().includes(storage.toLowerCase()))) &&
          (this.selectedScreens.length === 0 || this.selectedScreens.some((screen) => product.name.toLowerCase().includes(screen.toLowerCase()))) &&
          (this.selectedVgas.length === 0 || this.selectedVgas.some((vga) => product.name.toLowerCase().includes(vga.toLowerCase()))) &&
          (this.selectedCpus.length === 0 || this.selectedCpus.some((cpu) => product.name.toLowerCase().includes(cpu.toLowerCase())))
        );
      });
    }
    
    
    
    onCategoryFilterChange(event: any): void {
      const categoryId = +event.target.value;
    
      if (event.target.checked) {
        this.selectedCategories.push(categoryId);
      } else {
        this.selectedCategories = this.selectedCategories.filter((id) => id !== categoryId);
      }
    
      this.applyFilters(); // Cập nhật danh sách sản phẩm
    }
    

    onSupplierFilterChange(event: any): void {
      const supplierId = +event.target.value;
    
      if (event.target.checked) {
        this.selectedSupplier.push(supplierId); // Thêm nhà cung cấp vào mảng
      } else {
        // Xóa nhà cung cấp khỏi mảng nếu bị bỏ chọn
        this.selectedSupplier = this.selectedSupplier.filter((id) => id !== supplierId);
      }
    
      this.applyFilters(); // Cập nhật danh sách sản phẩm
    }
    
    onRamFilterChange(event: any): void {
      const ramValue = event.target.value;
    
      if (event.target.checked) {
        this.selectedRam.push(ramValue);
      } else {
        this.selectedRam = this.selectedRam.filter((ram) => ram !== ramValue);
      }
    
      this.applyFilters();  // Cập nhật bộ lọc
    }
    
    onStorageFilterChange(event: any): void {
      const storageValue = event.target.value;
    
      if (event.target.checked) {
        this.selectedStorage.push(storageValue);
      } else {
        this.selectedStorage = this.selectedStorage.filter((storage) => storage !== storageValue);
      }
    
      this.applyFilters();  // Cập nhật bộ lọc
    }
    
    onScreenFilterChange(event: any): void {
      const screenValue = event.target.value;
    
      if (event.target.checked) {
        this.selectedScreens.push(screenValue);
      } else {
        this.selectedScreens = this.selectedScreens.filter((screen) => screen !== screenValue);
      }
    
      this.applyFilters();  // Cập nhật bộ lọc
    }
    
    onVgaFilterChange(event: any): void {
      const vgaValue = event.target.value;
    
      if (event.target.checked) {
        this.selectedVgas.push(vgaValue);
      } else {
        this.selectedVgas = this.selectedVgas.filter((vga) => vga !== vgaValue);
      }
    
      this.applyFilters();  // Cập nhật bộ lọc
    }
    
    onCpuFilterChange(event: any): void {
      const cpuValue = event.target.value;
    
      if (event.target.checked) {
        this.selectedCpus.push(cpuValue);
      } else {
        this.selectedCpus = this.selectedCpus.filter((cpu) => cpu !== cpuValue);
      }
    
      this.applyFilters();  // Cập nhật bộ lọc
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

    sort(keyF: string) {
      if (keyF === 'enteredDate') {
        this.key = 'enteredDate';
        this.reverse = true;
      } else
        if (keyF === 'priceDesc') {
          this.key = '';
          this.products.sort((a, b) => b.price - a.price);
        } else
          if (keyF === 'priceAsc') {
            this.key = '';
            this.products.sort((a, b) => a.price - b.price);
          }
          else {
            this.key = '';
            this.getProducts();
          }
    }  

     // Hàm để chuyển đổi trạng thái hiển thị
  toggleFilter(filter: string): void {
    switch (filter) {
      case 'categories':
        this.showCategories = !this.showCategories;
        break;
      case 'suppliers':
        this.showSuppliers = !this.showSuppliers;
        break;
      case 'rams':
        this.showRams = !this.showRams;
        break;
      case 'storages':
        this.showStorages = !this.showStorages;
        break;
      case 'screens':
        this.showScreens = !this.showScreens;
        break;
      case 'vgas':
        this.showVgas = !this.showVgas;
        break;
      case 'cpus':
        this.showCpus = !this.showCpus;
        break;
    }
  }
    
  }
