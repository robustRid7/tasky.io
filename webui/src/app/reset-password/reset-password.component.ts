import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../services/signup.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private signupService: SignupService,

  ) {
    this.resetPasswordForm = this.fb.group({
      userId: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      console.log('Invalid form submission');
      this.toastr.error('Please fill all required fields correctly.', 'Invalid Submission');
      return;
    }
  
    console.log('Reset Password Request:', this.resetPasswordForm.value);
  
    this.signupService.sendResetLink(this.resetPasswordForm.value)
      .subscribe({
        next: (response) => {
          this.toastr.success('Reset link sent successfully. Check your email!', 'Success');
          console.log('Reset link sent successfully:', response);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.toastr.error(error.error?.message || 'Failed to send reset link.', 'Error');
          console.error('Error sending reset link:', error);
          // Optionally, show error message to user
        }
      });
  }
  
}
