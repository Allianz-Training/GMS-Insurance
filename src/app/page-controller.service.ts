import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Package } from './package';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class PageControllerService {
  packages: Package[];
  index: number;
  isMember: boolean;
  isLoginPage: boolean;
  isSignUpPage: boolean;
  isSelectedPack: boolean;
  selectedPackage: Package;
  user: User;
  pathDB: string;

  constructor(private http: HttpClient) {
    this.pathDB = 'http://localhost:8080/';
    this.user = null;
    this.index = 0;
    this.isLoginPage = false;
    this.isSignUpPage = false;
    if (window.localStorage.getItem('login') == null) {
      this.isMember = false;
    } else {
      this.isMember = true;
      this.getUser(window.localStorage.getItem('login'));
    }
    this.isSelectedPack = false;
    this.selectedPackage = null;
    this.packages = [
      new Package(
        1,
        'A',
        [
          'Product Lost',
          'Product Damaged',
          'Insurance Coverage Limit ( 10,000฿ )',
          'Compensate 30% of your product price',
        ],
        '120',
        10000,
        5000,
        'The company provided 10,000 baht of insurance coverage limit for the product claim. The claim that we include are product lost and product damaged. The company will pay 30% of your product.'
      ),
      new Package(
        2,
        'B',
        [
          'Product Lost',
          'Product Damaged',
          'Insurance Coverage Limit ( 15,000฿ )',
          'Compensate 40% of your product price',
        ],
        '120',
        15000,
        7000,
        'The company provided 15,000 baht of insurance coverage limit for the product claim. The claim that we include are product lost and product damaged. The company will pay 40% of your product.'
      ),
      new Package(
        3,
        'C',
        [
          'Product Lost',
          'Product Damaged',
          'Insurance Coverage Limit ( 40,000฿ )',
          'Compensate 100% of your product price',
        ],
        '120',
        40000,
        15000,
        'The company provided 40,000 baht of insurance coverage limit for the product claim. The claim that we include are product lost and product damaged. The company will pay 100% of your product.'
      ),
    ];
  }

  setPage(idx: number) {
    this.index = idx;
  }

  getPage(): number {
    return this.index;
  }

  setCurrentPackage(p: Package) {
    this.isSelectedPack;
    this.selectedPackage = p;
  }

  getPackageById(id: number): Package {
    for (let p of this.packages) {
      if (p.id == id) {
        return p;
      }
    }
    return null;
  }

  getUser(uid: string) {
    let path = this.pathDB + 'user/' + uid;
    this.http.get(path).subscribe((p) => {
      this.user = new User(
        p[0]['userId'],
        p[0]['name'],
        p[0]['surname'],
        p[0]['citizenId'],
        p[0]['email'],
        p[0]['password'],
        p[0]['tel']
      );
      this.user.packages = p[0]['packageInsurances'];
      this.user.claims = p[0]['claims'];
    });
  }
}
