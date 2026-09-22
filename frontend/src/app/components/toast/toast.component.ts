import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'bx bx-check-circle';
      case 'error': return 'bx bx-x-circle';
      case 'warning': return 'bx bx-error';
      case 'info': return 'bx bx-info-circle';
      default: return 'bx bx-bell';
    }
  }

  fermer(id: string): void {
    this.toastService.fermerToast(id);
  }
}
