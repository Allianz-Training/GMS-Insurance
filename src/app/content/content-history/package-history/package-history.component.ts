import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Package } from 'src/app/package';
import { PageControllerService } from 'src/app/page-controller.service';

@Component({
  selector: 'app-package-history',
  templateUrl: './package-history.component.html',
  styleUrls: ['./package-history.component.css'],
})
export class PackageHistoryComponent implements OnInit {
  @Input()
  ownPackage: any;

  package: Package;
  claims: any;
  currentClaims: any[];
  constructor(
    private http: HttpClient,
    private pageService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.package = this.pageService.getPackageById(
      this.ownPackage['typePackage']
    );
    this.loadClaims();
  }

  loadClaims() {
    this.claims = [];
    this.currentClaims = [];
    this.http
      .post('http://localhost:8080/history/findAllClaims', {
        userClaims: this.pageService.user.claims,
      })
      .subscribe((result) => {
        this.claims = result as any[];
        this.currentClaims = this.claims.filter((e) => {
          if (e['packageId'] == this.ownPackage.packageId) {
            return e;
          }
        });
      });
  }
}
