import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AbpModule } from '@abp/abp.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';

import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
import { TopBarComponent } from '@app/layout/topbar.component';
import { TopBarLanguageSwitchComponent } from '@app/layout/topbar-languageswitch.component';
import { SideBarUserAreaComponent } from '@app/layout/sidebar-user-area.component';
import { SideBarNavComponent } from '@app/layout/sidebar-nav.component';
import { SideBarFooterComponent } from '@app/layout/sidebar-footer.component';
import { RightSideBarComponent } from '@app/layout/right-sidebar.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// itemGroups
import { ItemGroupsComponent } from '@app/itemGroups/itemGroups.component';
import { CreateItemGroupDialogComponent } from './itemGroups/create-itemGroup/create-itemGroup-dialog.component';
import { EditItemGroupDialogComponent } from './itemGroups/edit-itemGroup/edit-itemGroup-dialog.component';
// items
import { ItemsComponent } from '@app/items/items.component';
import { CreateItemDialogComponent } from './items/create-item/create-item-dialog.component';
import { EditItemDialogComponent } from './items/edit-item/edit-item-dialog.component';
import { SearchItemsDialogComponent } from './items/search-item/search-item-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';

//CustomerGroup
import { CustomerGroupsComponent } from './customerGroups/customerGroups.component';
import { CreateCustomerGroupDialogComponent } from './customerGroups/create-customerGroup/create-customerGroup-dialog.component';
import { EditCustomerGroupDialogComponent } from './customerGroups/edit-customerGroup/edit-customerGroup-dialog.component';

//Customer
import { CustomersComponent } from './customers/customers.component';
import { CreateCustomerDialogComponent } from './customers/create-customer/create-customer-dialog.component';
import { EditCustomerDialogComponent } from './customers/edit-customer/edit-customer-dialog.component';

//Transaction
import { TransactionsComponent } from './transactions/transactions.component';
import { EditTransactionDialogComponent } from './transactions/edit-transaction/edit-transaction-dialog.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        TopBarComponent,
        TopBarLanguageSwitchComponent,
        SideBarUserAreaComponent,
        SideBarNavComponent,
        SideBarFooterComponent,
        RightSideBarComponent,
        // tenants
        TenantsComponent,
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        RolesComponent,
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        UsersComponent,
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ChangePasswordComponent,
        ResetPasswordDialogComponent,

        // itemGroups
        ItemGroupsComponent,
        CreateItemGroupDialogComponent,
        EditItemGroupDialogComponent,
        // items
        ItemsComponent,
        CreateItemDialogComponent,
        EditItemDialogComponent,
        SearchItemsDialogComponent,

        //CustomerGroup
        CustomerGroupsComponent,
        CreateCustomerGroupDialogComponent,
        EditCustomerGroupDialogComponent,

        //Customers
        CustomersComponent,
        CreateCustomerDialogComponent,
        EditCustomerDialogComponent,

        //Transactions
        TransactionsComponent,
        EditTransactionDialogComponent,
      
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forRoot(),
        AbpModule,
        AppRoutingModule,
        ServiceProxyModule,
        SharedModule,
        NgxPaginationModule
    ],
    providers: [],
    entryComponents: [
        // tenants
        CreateTenantDialogComponent,
        EditTenantDialogComponent,
        // roles
        CreateRoleDialogComponent,
        EditRoleDialogComponent,
        // users
        CreateUserDialogComponent,
        EditUserDialogComponent,
        ResetPasswordDialogComponent,
        // itemGroups
        CreateItemGroupDialogComponent,
        EditItemGroupDialogComponent,
        // items
        CreateItemDialogComponent,
        EditItemDialogComponent,
        SearchItemsDialogComponent,

        //customerGroups
        CreateCustomerGroupDialogComponent,
        EditCustomerGroupDialogComponent,

        //customers
        CreateCustomerDialogComponent,
        EditCustomerDialogComponent,

        //Transaction
        EditTransactionDialogComponent
    ]
})
export class AppModule { }
