import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'add-subscription',
    loadComponent: () =>
      import('./pages/add-subscription/add-subscription.page')
        .then(m => m.AddSubscriptionPage)
  },
  {
    path: 'subscription-detail/:id',
    loadComponent: () =>
      import('./pages/subscription-detail/subscription-detail.page')
        .then(m => m.SubscriptionDetailPage)
  }
];
