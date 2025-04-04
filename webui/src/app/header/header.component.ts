import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userProfileImage: any = ''//'assets/user.pf.png'; // Default Image

  constructor(
    private toastr: ToastrService,
    private sharedService: SharedService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.sharedService.profileUpdated$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  loadUserProfile(): void {
    // First, check if profile picture is in local storage
    const storedProfileImage = localStorage.getItem('profilePicture');
    if (storedProfileImage) {
      this.userProfileImage = storedProfileImage;
    } else {
      let user:any = localStorage.getItem('user');
      user = JSON.parse(user);
      console.log(user);
      this.userService.getImage(user.profilePicture).subscribe({
        next: (imageBlob) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageBlob);
          reader.onloadend = () => {
            this.userProfileImage = reader.result;
            localStorage.setItem('profilePicture', this.userProfileImage);
          };
        },
        error: () => {
          this.toastr.error('Failed to load profile image');
        }
      });
    }
  }
}
