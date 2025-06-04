import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import { Product } from '../../common/Product';
import { PageService } from '../../services_admin/page.service';
import { ProductService } from '../../services_admin/product.service';

@Component({
  selector: 'app-soldest',
  templateUrl: './soldest.component.html',
  styleUrls: ['./soldest.component.css']
})
export class SoldestComponent_Admin implements OnInit {

  listData!: MatTableDataSource<Product>;
  products!: Product[];
  productsLength!: number;
  columns: string[] = ['image', 'productId', 'name', 'sold', 'category'];

  labels: string[] = [];
  data: number[] = [];
  myChartBar !: Chart;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private productService: ProductService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('soldest');
    this.getProduct();
    Chart.register(...registerables);
  }

  getProduct() {
    this.productService.getBestSeller().subscribe(data => {
      this.products = data as Product[];
      this.listData = new MatTableDataSource(this.products);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      // Clear existing labels and data
      this.labels = [];
      this.data = [];

      // Process the first 10 products for their names and prepare data
      for (let i = 0; i < 10; i++) {
        const name = this.products[i].name.trim(); 
        const indexOfSlash = name.indexOf('/'); 

        // If a slash exists in the name, split it
        if (indexOfSlash !== -1) {
          // Normal part before the slash
          this.products[i].normalPart = name.substring(0, indexOfSlash).trim();
          // Remaining part after the last space in normalPart
          const lastSpaceIndex = this.products[i].normalPart.lastIndexOf(' '); 
          this.products[i].normalPart = name.substring(0, lastSpaceIndex).trim();
          
          // Remaining part after the last space is considered as styled part
          this.products[i].styledPart = name.substring(lastSpaceIndex).trim(); 
        } else {
          // If no slash exists, the entire name is considered normal part
          this.products[i].normalPart = name;
          this.products[i].styledPart = '';
        }

        // Add the processed name (normal part) to the labels
        this.labels.push(this.products[i].normalPart);
        // Add the sold quantity or quantity to the data for the chart
        this.data.push(this.products[i].sold);  // You can also use `quantity` if required
      }

      // After processing, load the chart with updated data
      this.loadChartBar();
    }, error => {
      console.log(error);
    });
  }

  loadChartBar() {
    this.myChartBar = new Chart('chart', {
      type: 'polarArea',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(0, 162, 71, 0.6)',
            'rgba(82, 0, 36, 0.6)',
            'rgba(82, 164, 36, 0.6)',
            'rgba(255, 158, 146, 0.6)',
            'rgba(123, 39, 56, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

}
