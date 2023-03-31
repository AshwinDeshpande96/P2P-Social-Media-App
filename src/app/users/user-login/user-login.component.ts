import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  //   selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit, OnDestroy {
  isLoading = true;

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngOnDestroy(): void {}

  onLogin(form: NgForm) {
    if (form!.invalid) {
      return;
    }
    console.log(form.value);
  }
}
//minlength="8"
// passwordSecurity="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)"
