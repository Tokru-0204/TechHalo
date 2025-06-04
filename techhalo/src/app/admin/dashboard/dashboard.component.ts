import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatisticalService } from '../../services_admin/statistical.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from '../../common/ChatMessage';
import { Customer } from '../../common/Customer';
import { Order } from '../../common/Order';
import { Statistical } from '../../common/Statistical';
import { CustomerService } from '../../services_admin/customer.service';
import { OrderService } from '../../services_admin/order.service';
import { PageService } from '../../services_admin/page.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent_Admin implements OnInit {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  day: number = new Date().getDate();
  countYears: number[] = [];
  labels: string[] = [];
  data: number[] = [];
  revenueDayNow!: number;
  revenueMonthNow!: number;
  revenueYearNow!: number;
  myChart!: Chart;


  orderHandle!: number;
  customerLength!: number;
  orders!: Order[];
  customers!: Customer[];

  statistical!: Statistical[];
  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  constructor(private pageService: PageService, private toastr: ToastrService, private orderService: OrderService, private customerService: CustomerService, private statisticalService: StatisticalService) { }

  ngOnInit(): void {
    this.openWebSocket();
    this.pageService.setPageActive('dashboard');
    this.getAllOrder();
    this.getAllCustomer();
    Chart.register(...registerables);
    Chart.register(...registerables);
    this.loadDefaultRevenue();
    this.loadYears();
    this.updateChart('year');
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  loadDefaultRevenue() {
    this.statisticalService.getRevenueByYear(this.year).subscribe((revenue: any) => {
      this.revenueYearNow = revenue;
    });
    this.statisticalService.getRevenueByMonth(this.year, this.month).subscribe((revenue: any) => {
      this.revenueMonthNow = revenue;
    });
    this.statisticalService.getRevenueByDay(this.year, this.month, this.day).subscribe((revenue: any) => {
      this.revenueDayNow = revenue;
    });
  }

  loadYears() {
    this.statisticalService.getCountYear().subscribe((years: any) => {
      this.countYears = years;
    });
  }

  updateChart(period: 'year' | 'month' | 'day') {
    if (period === 'year') {
      this.statisticalService.getRevenueByYearDetails(this.year).subscribe((data: any[]) => {
        this.labels = data.map((item) => `Tháng ${item.month}`);
        this.data = data.map((item) => item.amount || 0); // Điền 0 nếu không có dữ liệu
        this.renderChart();
      });
    } else if (period === 'month') {
      this.statisticalService.getRevenueByMonthDetails(this.year, this.month).subscribe((data: any[]) => {
        this.labels = data.map((item) => `Ngày ${item.day}`);
        this.data = data.map((item) => item.amount || 0); // Điền 0 nếu không có dữ liệu
        this.renderChart();
      });
    } else if (period === 'day') {
      this.statisticalService.getRevenueByDayDetails(this.year, this.month, this.day).subscribe((data: any[]) => {
        console.log('Dữ liệu nhận được từ API:', data);
      
        // Tạo nhãn (labels) từ 0h đến 23h
        this.labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
      
        // Điền dữ liệu với giá trị amount từ API
        this.data = data.map((item) => item.amount || 0);
      
        // Render lại biểu đồ
        this.renderChart();
      });
    }
  }
  

  selectYear(year: number) {
    this.year = year;
    this.updateChart('year');
  }

  getAllOrder() {
    this.orderService.get().subscribe(data => {
      this.orders = data as Order[];
      this.orderHandle = 0;
      for (let i = 0; i < this.orders.length; i++) {
        if (this.orders[i].status == 0) {
          this.orderHandle++;
        }
      }
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getAllCustomer() {
    this.customerService.getAll().subscribe(data => {
      this.customers = data as Customer[];
      this.customerLength = this.customers.length;
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }
  renderChart() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    
    if (this.myChart) {
        // Kiểm tra nếu biểu đồ đã tồn tại, hủy bỏ nó trước khi tạo lại
        this.myChart.destroy();
    }

    // Tạo lại biểu đồ mới với dữ liệu mới
    this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: this.labels, // Các nhãn trên trục X
            datasets: [{
                label: 'Doanh thu',
                data: this.data, // Giá trị doanh thu
                borderColor: '#2575fc',
                backgroundColor: 'rgba(37, 117, 252, 0.2)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#2575fc', // Màu của điểm
                pointRadius: 5, // Kích thước điểm bình thường
                pointHoverRadius: 8, // Kích thước điểm khi hover (lớn hơn pointRadius)
                datalabels: {
                  display: false // Ẩn nhãn hiển thị trên điểm
              }
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
                },
                x: {
                    // Đảm bảo các nhãn trên trục X hiển thị đúng
                    ticks: {
                        autoSkip: true, // Tự động bỏ qua một số nhãn nếu quá nhiều
                        // maxTicksLimit: 20, // Giới hạn số lượng nhãn hiển thị
                    },
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    bodyFont: {
                        size: 12,
                        lineHeight: 1.2,
                    },
                    callbacks: {
                      label: function(context) {
                        // Ép kiểu amount thành number trước khi sử dụng
                        const amount = Number(context.raw); // Lấy giá trị doanh thu
                        const formattedAmount = new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            currencyDisplay: 'code', // Hiển thị VNĐ sau số tiền
                            minimumFractionDigits: 0 // Không hiển thị phần thập phân
                        }).format(amount); // Định dạng tiền tệ theo định dạng Việt Nam
                        return `Doanh thu: ${formattedAmount}`; // Hiển thị VNĐ sau số tiền
                    }
                }
            },
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            maintainAspectRatio: false // Bỏ tỷ lệ mặc định của biểu đồ
        }
    });

    // Cập nhật biểu đồ sau khi render lại
    this.myChart.update();
}




openWebSocket() {
  this.webSocket = new WebSocket('ws://localhost:8080/notification');

  this.webSocket.onopen = (event) => {
    // console.log('Open: ', event);
  };

  this.webSocket.onmessage = (event) => {
    this.getAllOrder();
  };

  this.webSocket.onclose = (event) => {
    // console.log('Close: ', event);
  };
}

closeWebSocket() {
  this.webSocket.close();
}
  
  
  
  
  
  
  
  
  
  
  
}
