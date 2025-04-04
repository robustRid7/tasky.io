import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SignupService } from '../services/signup.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  userIdAvailable: boolean | null = null;
  private userIdCheckTimeout: any;

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private signupService: SignupService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    

    this.signupForm.get('userId')?.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(userId => {
      if (userId.trim().length > 0) {
        this.userIdAvailable = null;
        this.checkUserIdAvailability(userId)
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  checkUserIdAvailability(userId: string): void {
    this.signupService.isUserIdAvailable(userId).subscribe(
      (response) => {
        this.userIdAvailable = response?.available;
      },
      (error) => {
        console.error('Error checking userId:', error);
        this.userIdAvailable = false;
      }
    );
  }

  // onSubmit(): void {
  //   if (this.signupForm.valid && this.userIdAvailable) {
  //     this.signupService.signup(this.signupForm.value).subscribe({
  //       next: (response) => {
  //         console.log('Signup Successful:', response);
  //         this.toastr.success('You have successfully registered!', 'Signup Successful');
  //       },
  //       error: (error) => {
  //         console.error('Signup Failed:', error);
  //         this.toastr.error(error?.error?.message || 'Something went wrong. Please try again!', 'Signup Failed');
  //       }
  //     });
  //   }else {
  //     this.toastr.error('User name is taken!', 'Signup Failed');
  //   }
  // }  
  onSubmit(): void {
    if (this.signupForm.valid && this.userIdAvailable) {
      this.signupService.signup(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Signup Successful:', response);
          this.toastr.success('You have successfully registered!', 'Signup Successful');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error) => {
          console.error('Signup Failed:', error);
          this.toastr.error(error?.error?.message || 'Something went wrong. Please try again!', 'Signup Failed');
          this.signupForm.reset();
        }
      });
    } else {
      this.toastr.error('User name is taken!', 'Signup Failed');
      this.signupForm.reset();
    }
  }
}
