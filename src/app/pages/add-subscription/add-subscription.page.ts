import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption, IonButtons, IonBackButton
} from '@ionic/angular/standalone';

import { SubscriptionsService } from '../../services/subscriptions.service';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.page.html',
  styleUrls: ['./add-subscription.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonButtons,
    IonBackButton
  ]
})
export class AddSubscriptionPage {

  name = '';
  price: number | null = null;
  billingCycle: 'monthly' | 'yearly' = 'monthly';

  constructor(private subService: SubscriptionsService) {}

  addSubscription() {
  if (!this.name || !this.price) return;

  const newSub: Subscription = {
    id: Date.now().toString(),
    name: this.name,
    price: this.price,
    billingCycle: this.billingCycle,
    renewalDate: this.getRenewalDate(this.billingCycle)
  };

  this.subService.add(newSub);

  this.name = '';
  this.price = null;
}

getRenewalDate(cycle: 'monthly' | 'yearly'): string {
  const date = new Date();

  if (cycle === 'monthly') {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString();
}
}