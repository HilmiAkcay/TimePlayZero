import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    CustomerGroupServiceProxy,
    CustomerGroupDto,
    PagedResultDtoOfCustomerGroupDto
   
} from '@shared/service-proxies/service-proxies';
import { CreateCustomerGroupDialogComponent } from './create-customerGroup/create-customerGroup-dialog.component';
import { EditCustomerGroupDialogComponent } from './edit-customerGroup/edit-customerGroup-dialog.component';

class PagedCustomerGroupsRequestDto extends PagedRequestDto {
    keyword: string;
}

@Component({
    templateUrl: './customerGroups.component.html',
    animations: [appModuleAnimation()],
    styles: [
        `
          mat-form-field {
            padding: 10px;
          }
        `
    ]
})
export class CustomerGroupsComponent extends PagedListingComponentBase<CustomerGroupDto> {
    customerGroups: CustomerGroupDto[] = [];

    keyword = '';

    constructor(
        injector: Injector,
        private _customerGroupService: CustomerGroupServiceProxy,
        private _dialog: MatDialog
    ) {
        super(injector);
    }

    list(
        request: PagedCustomerGroupsRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;

        this._customerGroupService
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
        )
            .subscribe((result: PagedResultDtoOfCustomerGroupDto) => {
                this.customerGroups = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(role: CustomerGroupDto): void {
        abp.message.confirm(
            this.l('DeleteWarningMessage', role.name),
            (result: boolean) => {
                if (result) {
                    this._customerGroupService
                        .delete(role.id)
                        .pipe(
                            finalize(() => {
                                abp.notify.success(this.l('SuccessfullyDeleted'));
                                this.refresh();
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }

    createCustomerGroup(): void {
        this.showCreateOrEditCustomerGroupDialog();
    }

    editCustomerGroup(role: CustomerGroupDto): void {
        this.showCreateOrEditCustomerGroupDialog(role.id);
    }

    showCreateOrEditCustomerGroupDialog(id?: number): void {
        let createOrEditCustomerGroupDialog;
        if (id === undefined || id <= 0) {
            createOrEditCustomerGroupDialog = this._dialog.open(CreateCustomerGroupDialogComponent);
        } else {
            createOrEditCustomerGroupDialog = this._dialog.open(EditCustomerGroupDialogComponent, {
                data: id
            });
        }

        createOrEditCustomerGroupDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
