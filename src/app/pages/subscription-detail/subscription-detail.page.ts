import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonButtons,
  IonBackButton
} from '@ionic/angular/standalone';

import { SubscriptionsService } from '../../services/subscriptions.service';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.page.html',
  styleUrls: ['./subscription-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonButtons,
    IonBackButton
  ]
})
export class SubscriptionDetailPage {

  subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private subService: SubscriptionsService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.subscription = this.subService.getById(id!);
  }

  updateSubscription() {
    if (!this.subscription) return;

    this.subService.delete(this.subscription.id);
    this.subService.add(this.subscription);

    this.router.navigate(['/']);
  }
}