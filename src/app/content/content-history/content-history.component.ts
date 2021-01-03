import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageControllerService } from 'src/app/page-controller.service';

@Component({
  selector: 'app-content-history',
  templateUrl: './content-history.component.html',
  styleUrls: ['./content-history.component.css'],
})
export class ContentHistoryComponent implements OnInit {
  packages: string[];
  ownPackages: any;
  constructor(
    private pageService: PageControllerService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.pageService.isMember) {
      alert('Please login');
      this.router.navigate(['/home']);
    } else {
      this.packages = this.pageService.user.packages;
      this.ownPackageSearch();
    }
    this.pageService.setPage(4);
  }

  ownPackageSearch() {
    let path = this.pageService.pathDB + 'history/findAllPackages';
    this.http
      .post(path, {
        userPackages: this.packages,
      })
      .subscribe(
        (result) => {
          this.ownPackages = result;
          console.log('result', result);
        },
        (error) => {
          console.log('error', error);
        }
      );
  }
}
