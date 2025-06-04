import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionCodeService } from '../../services_admin/promotion-code.service';
import { AuthService } from '../../services_admin/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-promotion-users',
  templateUrl: './add-promotion-users.component.html',
  styleUrls: ['./add-promotion-users.component.css']
})
export class AddPromotionUsersComponent_Admin implements OnInit {
  @Input() promotionCodeId!: number;
  @Output() saveFinish = new EventEmitter<void>();

  addUsersForm: FormGroup;
  applyType = '';
  users: any[] = [];
  filteredUsers: any[] = [];
  appliedDiscountUsers: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private promotionCodeService: PromotionCodeService,
    private userService: AuthService,
    private toastr: ToastrService
  ) {
    this.addUsersForm = new FormGroup({
      applyType: new FormControl('', Validators.required),
      userIds: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.loadAppliedUsers(this.promotionCodeId);
    this.onApplyTypeChange();
  }

  // Lấy danh sách người dùng đã áp dụng mã khuyến mãi
  loadAppliedUsers(promotionCodeId: number) {
    this.promotionCodeService.getUsersByPromotionCode(promotionCodeId).subscribe(users => {
      this.appliedDiscountUsers = users;

      // Remove applied users from the available list (filtered and main lists)
    this.filteredUsers = this.filteredUsers.filter(user =>
        !users.some(appliedUser => appliedUser.userId === user.userId)
      );
      this.users = this.users.filter(user =>
        !users.some(appliedUser => appliedUser.userId === user.userId)
      );
    });
  }

  // Xử lý thay đổi applyType
  onApplyTypeChange() {
    this.applyType = this.addUsersForm.get('applyType')?.value || '';
    this.addUsersForm.patchValue({ userIds: [] });
    this.filteredUsers = [];

    if (this.applyType === 'specific' && this.promotionCodeId) {
      this.userService.getAvailableUsersNotInPromotion(this.promotionCodeId).subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
      });
    } else if (this.applyType === 'all') {
      this.userService.getAvailableUsersNotInPromotion(this.promotionCodeId).subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
        console.log(users);
        console.log(this.filteredUsers);
      });
    }
  }

  // Tìm kiếm người dùng theo tên
  onSearchUsers(event: Event): void {
    const input = (event.target as HTMLInputElement).value || '';
    this.searchUsers(input);
  }

  // Lọc người dùng
  searchUsers(query: string) {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Kiểm tra người dùng có được chọn hay không
  isUserSelected(userId: number): boolean {
    const selectedUserIds = this.addUsersForm.get('userIds')?.value || [];
    return selectedUserIds.includes(userId);
  }

  // Xử lý việc chọn người dùng
  toggleUserSelection(userId: number) {
    const selectedUserIds = this.addUsersForm.get('userIds')?.value || [];
    const index = selectedUserIds.indexOf(userId);

    if (index > -1) {
      selectedUserIds.splice(index, 1);
    } else {
      selectedUserIds.push(userId);
    }

    this.addUsersForm.patchValue({ userIds: selectedUserIds });
  }

  // Áp dụng mã cho người dùng
  applyUsers() {
    const applyType = this.addUsersForm.get('applyType')?.value;
    if (applyType === 'all') {
      this.applyAllUsers();
    } else if (applyType === 'specific') {
      const userIds = this.addUsersForm.get('userIds')?.value;
      if (userIds && userIds.length > 0) {
        this.applySpecificUsers(userIds);
      } else {
        this.toastr.warning("Vui lòng chọn ít nhất một người dùng.");
      }
    }
  }

 // Áp dụng mã cho tất cả người dùng
applyAllUsers() {
   
    this.promotionCodeService.applyPromotionCodeToAllUsers(this.promotionCodeId)
      .subscribe(() => {
        this.toastr.success("Khuyến mãi đã áp dụng cho tất cả người dùng.");
        
        this.loadAppliedUsers(this.promotionCodeId);
        
        this.saveFinish.emit();
      }, error => {
        this.toastr.error("Không thể áp dụng khuyến mãi cho tất cả người dùng.");
      });
  }
  
  // Áp dụng mã cho người dùng cụ thể
  applySpecificUsers(userIds: number[]) {
    this.promotionCodeService.applyPromotionCodeToUsers(this.promotionCodeId, userIds)
      .subscribe(() => {
        this.toastr.success("Khuyến mãi đã áp dụng cho người dùng được chọn.");
        
        this.loadAppliedUsers(this.promotionCodeId);
  
        this.saveFinish.emit();
      }, error => {
        this.toastr.error("Không thể áp dụng khuyến mãi cho người dùng đã chọn.");
      });
  }
  // Xóa người dùng khỏi chương trình khuyến mãi
  removeUserFromPromotion(userId: number) {
    this.promotionCodeService.removeUserFromPromotion(this.promotionCodeId, userId)
        .subscribe(() => {
            this.appliedDiscountUsers = this.appliedDiscountUsers.filter(user => user.userId !== userId);
            this.toastr.success("Người dùng đã bị xóa khỏi chương trình khuyến mãi.");
        }, error => {
            this.toastr.error("Không thể xóa người dùng.");
        });
  }

  close() {
    this.activeModal.dismiss('cancelled');
  }
}
