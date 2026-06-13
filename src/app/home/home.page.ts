import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonButton,
  IonItem,
  IonLabel, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle
} from '@ionic/angular/standalone';

import { SubscriptionsService } from '../services/subscriptions.service';
import { Subscription } from '../models/subscription.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonButton,
    IonItem,
    IonLabel,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle
  ]
})
export class HomePage {

  subscriptions: Subscription[] = [];

  totalMonthly = 0;
  totalYearly = 0;
  mostExpensive: any = null;
  expiringSoon: any[] = [];

  constructor(
    private subService: SubscriptionsService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.subscriptions = this.subService.getAll();

    this.sortByRenewalDate();
    this.calculateStats();
    this.calculateAlerts();
  }

  getDaysLeft(dateString: string): number {
    const today = new Date();
    const date = new Date(dateString);

    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days < 0 ? 0 : days;
  }

  calculateAlerts() {
    this.expiringSoon = this.subscriptions
      .map(sub => ({
        ...sub,
        daysLeft: this.getDaysLeft(sub.renewalDate)
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }

  calculateStats() {
    this.totalMonthly = 0;
    this.totalYearly = 0;

    if (!this.subscriptions.length) return;

    this.mostExpensive = this.subscriptions[0];

    for (const sub of this.subscriptions) {

      if (sub.billingCycle === 'monthly') {
        this.totalMonthly += sub.price;
      } else {
        this.totalMonthly += sub.price / 12;
      }

      if (sub.billingCycle === 'yearly') {
        this.totalYearly += sub.price;
      } else {
        this.totalYearly += sub.price * 12;
      }

      if (sub.price > this.mostExpensive.price) {
        this.mostExpensive = sub;
      }
    }
  }

  goAdd() {
    this.router.navigate(['/add-subscription']);
  }

  editSub(id: string) {
    this.router.navigate(['/subscription-detail', id]);
  }

  deleteSub(event: Event, id: string) {
    event.stopPropagation();

    this.subService.delete(id);
    this.subscriptions = this.subService.getAll();

    this.sortByRenewalDate();
    this.calculateStats();
    this.calculateAlerts();
  }

  sortByRenewalDate() {
    this.subscriptions.sort((a, b) => {
      return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
    });
  }
}