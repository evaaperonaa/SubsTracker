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
  IonLabel, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle,
  IonToggle
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
    IonCardSubtitle,
    IonToggle,
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

  getIcon(name: string): string {
  const service = name.toLowerCase();

  if (service.includes('netflix')) return '🎬';
  if (service.includes('spotify')) return '🎵';
  if (service.includes('disney')) return '🏰';
  if (service.includes('prime')) return '📺';
  if (service.includes('youtube')) return '▶️';
  if (service.includes('chatgpt')) return '🤖';
  if (service.includes('adobe')) return '🎨';
  if (service.includes('xbox')) return '🎮';

  return '📦';
}

darkMode = false;

ngOnInit() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    this.darkMode = true;
    document.body.classList.add('dark');
  }
}

async toggleDarkMode() {

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.zIndex = '9999';
  overlay.style.background = 'rgba(0,0,0,0)';
  overlay.style.backdropFilter = 'blur(0px)';
  overlay.style.transition = 'all 0.2s ease';

  document.body.appendChild(overlay);

  // forzar render inmediato (CLAVE)
  await new Promise(requestAnimationFrame);

  overlay.style.background = this.darkMode
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(0,0,0,0.4)';

  overlay.style.backdropFilter = 'blur(6px)';

  setTimeout(() => {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');

    // quitar overlay a la vez
    overlay.style.opacity = '0';

    setTimeout(() => overlay.remove(), 200);

  }, 120);
}

}