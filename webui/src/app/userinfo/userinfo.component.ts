import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { SignupService } from '../services/signup.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent {
  userForm!: FormGroup;
  userProfileImage: any = localStorage.getItem('profilePicture') ?? 'assets/user.pf.png';
  selectedFile: File | null = null;
  userIdAvailable: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private userService: UserService,
    private toastr: ToastrService,
    private signupService: SignupService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      userId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
    });
  }

  // loadUserData() {
  //   this.userService.getUserProfile().subscribe({
  //     next: (data) => {
  //       let { user } = data;
  //       this.userForm.patchValue(user);
  //       if (user.profileImage) {
  //         this.userProfileImage = user.profileImage;
  //       }
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to load user profile');
  //     }
  //   });
  // }

  loadUserData() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        let { user } = data;
        this.userForm.patchValue(user);
        const storedProfileImage = localStorage.getItem('profilePicture');
        if(storedProfileImage){
          this.userProfileImage = storedProfileImage;
        }else if(user.profilePicture){
          this.userService.getImage(user.profilePicture).subscribe({
            next: (imageBlob) => {
              const reader = new FileReader();
              reader.readAsDataURL(imageBlob);
              reader.onloadend = () => {
                this.userProfileImage = reader.result; 
              };
            },
            error: () => {
              this.toastr.error('Failed to load profile image');
            }
          });
        }
      },
      error: () => {
        this.toastr.error('Failed to load user profile');
      }
    });
  }
  

  checkUserIdAvailability(userId: string): void {
    if (!userId) {
      this.userIdAvailable = null;
      return;
    }

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfileImage = e.target.result;
        // localStorage.removeItem('profilePicture');
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.userForm.valid && this.userIdAvailable !== false) {
      const formData = new FormData();
      formData.append('firstName', this.userForm.value.firstName);
      formData.append('userId', this.userForm.value.userId);
      formData.append('lastName', this.userForm.value.lastName);
      formData.append('email', this.userForm.value.email);

      if (this.userForm.value.password) {
        formData.append('password', this.userForm.value.password);
      }

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.userService.updateUserProfile(formData).subscribe({
        next: (updateData) => {
          this.toastr.success('Profile updated successfully!');
          localStorage.setItem('profilePicture', this.userProfileImage);
          this.userForm.patchValue(updateData.user);
          this.sharedService.notifyProfileUpdated();
        },
        error: () => {
          this.toastr.error('Failed to update profile');
        }
      });
    } else {
      this.toastr.error('Please fix errors before submitting.');
    }
  }
}
