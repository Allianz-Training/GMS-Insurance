import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from 'src/app/package';
import { PageControllerService } from 'src/app/page-controller.service';

@Component({
  selector: 'app-content-payment',
  templateUrl: './content-payment.component.html',
  styleUrls: ['./content-payment.component.css'],
})
export class ContentPaymentComponent implements OnInit {
  package: Package;
  constructor(
    private pService: PageControllerService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.package = null;
    if (!this.pService.isMember) {
      alert('Please login');
      this.router.navigate(['/home']);
    }
    this.route.params.subscribe((p) => {
      this.package = this.pService.getPackageById(p['id']);
      if (this.package == null) {
        alert('Invalid Package!');
        this.router.navigate(['/packages']);
      }
    });
  }

  confirmClick() {
    let path =
      this.pService.pathDB +
      'user/' +
      this.pService.user.userId +
      '/addPackage';
    console.log(path);

    this.http
      .post(path, {
        typePackage: this.package.id,
        price: this.package.insuranceAmount,
      })
      .subscribe(
        (result) => {
          alert('Payment Success!');
          this.router.navigate(['/history']);
          this.refreshPackage();
        },
        (error) => {
          alert('Payment Failed');
        }
      );
  }

  refreshPackage() {
    let path = this.pService.pathDB + 'user/' + this.pService.user.userId;
    this.http.get(path).subscribe((result) => {
      this.pService.user.packages = result['packageInsurances'];
      this.pService.user.claims = result['claims'];
    });
  }
}
