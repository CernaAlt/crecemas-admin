import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-token-refresh-modal',
  imports: [NgIf],
  templateUrl: './token-refresh-modal.component.html',
  styleUrl: './token-refresh-modal.component.css'
})
export class TokenRefreshModalComponent {

  isVisible: boolean = false;

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

}
