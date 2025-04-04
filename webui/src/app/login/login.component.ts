import { Component } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private signupService: SignupService
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.signupService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.toastr.success('Login successful!', 'Welcome');
  
          // Store token and user details in local storage
          localStorage.setItem('token', response.token);
          console.log(response.user)
          localStorage.setItem('user', JSON.stringify(response.user));
  
          // Redirect to dashboard or home page
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login Failed:', error);
          this.toastr.error(error?.error?.message || 'Invalid credentials. Try again!');
  
          // Reset password field after error
          this.loginForm.patchValue({ password: '' });
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly.', 'Login Failed');
    }
  }
  
}
