import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  //   selector: 'app-user-login',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css'],
})
export class UserSignupComponent implements OnInit, OnDestroy {
  isLoading = true;

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {}

  onLogin(form: NgForm) {
    if (form!.invalid) {
      return;
    }
  }
}
