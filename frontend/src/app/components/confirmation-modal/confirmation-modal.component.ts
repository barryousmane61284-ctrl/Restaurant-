import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);

  demandeActuelle: any = null;

  ngOnInit(): void {
    this.confirmationService.demande$.subscribe((demande) => {
      this.demandeActuelle = demande;
    });
  }

  confirmer(): void {
    if (this.demandeActuelle?.resolve) {
      this.demandeActuelle.resolve(true);
    }
  }

  annuler(): void {
    if (this.demandeActuelle?.resolve) {
      this.demandeActuelle.resolve(false);
    }
  }
}
