import { Injectable } from '@angular/core';
import { Subscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private storageKey = 'subscriptions';
  private subscriptions: Subscription[] = [];

  constructor() {
    this.loadFromStorage();
  }

  getAll(): Subscription[] {
    return this.subscriptions;
  }

  add(sub: Subscription) {
    this.subscriptions.push(sub);
    this.saveToStorage();
  }

  getById(id: string) {
    return this.subscriptions.find(s => s.id === id);
  }

  delete(id: string) {
    this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.subscriptions));
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.subscriptions = JSON.parse(data);
    }
  }
}