import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ItemGroupsComponent } from 'app/itemGroups/itemGroups.component';
import { ItemsComponent } from 'app/items/items.component';
import { CustomerGroupsComponent } from 'app/customerGroups/customerGroups.component';
import { CustomersComponent } from 'app/customers/customers.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { TransactionsComponent } from 'app/transactions/transactions.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'transactions', component: TransactionsComponent, data: { permission: 'Pages.Transactions' }, canActivate: [AppRouteGuard] },
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'itemGroups', component: ItemGroupsComponent, data: { permission: 'Pages.ItemGroups' }, canActivate: [AppRouteGuard] },
                    { path: 'items', component: ItemsComponent, data: { permission: 'Pages.Items' }, canActivate: [AppRouteGuard] },
                    { path: 'customerGroups', component: CustomerGroupsComponent, data: { permission: 'Pages.CustomerGroups' }, canActivate: [AppRouteGuard] },
                    { path: 'customers', component: CustomersComponent, data: { permission: 'Pages.Customers' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent },
                    { path: 'update-password', component: ChangePasswordComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
