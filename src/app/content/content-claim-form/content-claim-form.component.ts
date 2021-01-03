import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwnPackage } from 'src/app/own-package';
import { Package } from 'src/app/package';
import { PageControllerService } from 'src/app/page-controller.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-content-claim-form',
  templateUrl: './content-claim-form.component.html',
  styleUrls: ['./content-claim-form.component.css'],
})
export class ContentClaimFormComponent implements OnInit {
  packages: string[];
  ownPackages: any;
  imageURL: string;
  myForm: FormGroup;
  constructor(
    private pageService: PageControllerService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.packages = ['Test'];

    this.myForm = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      tracking: ['', Validators.required],
      price: ['', Validators.required],
      package: ['', Validators.required],
      productImage: [null],
    });
  }

  ngOnInit(): void {
    if (!this.pageService.isMember) {
      alert('Please login');
      this.router.navigate(['/home']);
    }
    this.packages = this.pageService.user.packages;
    this.ownPackageSearch();
    this.pageService.setPage(5);
  }

  submitClick() {
    let path =
      this.pageService.pathDB +
      'claimFrom/' +
      this.pageService.user.userId +
      '/addClaim';
    this.http
      .post(path, {
        packageId: this.myForm.get('package').value,
        trackNumber: this.myForm.get('tracking').value,
        deliveryCompany: this.myForm.get('company').value,
        nameProduct: this.myForm.get('name').value,
        photoProduct: 'Test',
        price: this.myForm.get('price').value,
      })
      .subscribe(
        (p) => {
          this.pageService.user = new User(
            p['userId'],
            p['name'],
            p['surname'],
            p['citizenId'],
            p['email'],
            p['password'],
            p['tel']
          );
          this.pageService.user.packages = p['packageInsurances'];
          this.pageService.user.claims = p['claims'];
          this.myForm.reset;
          alert('Added claim');
          this.router.navigate(['/history']);
        },
        (error) => {
          alert("Something's wrong");
        }
      );
  }

  comparePackageType(id: number): Package {
    return this.pageService.getPackageById(id);
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

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.myForm.patchValue({
      productImage: file,
    });
    this.myForm.get('productImage').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(file);
  }

  refreshPackage() {
    let path = this.pageService.pathDB + 'user/' + this.pageService.user.userId;
    this.http.get(path).subscribe((result) => {
      this.pageService.user.packages = result['packageInsurances'];
      this.pageService.user.claims = result['claims'];
    });
  }
}

// If cannot show the preivew image : npm install @angular/cli -g
