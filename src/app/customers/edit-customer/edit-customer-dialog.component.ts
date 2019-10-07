import { Component, Injector, Inject, OnInit, Optional } from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatCheckboxChange
} from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
    CustomerServiceProxy,
    CustomerGroupServiceProxy,
    PermissionDto,
    CustomerDto,
    CustomerGroupDto,
} from '@shared/service-proxies/service-proxies';


export interface ItemType {
    id: number;
    value: string;
}

@Component({
    templateUrl: 'edit-customer-dialog.component.html',
    styles: [
        `
      mat-form-field {
        width: 100%;
      }
      mat-checkbox {
        padding-bottom: 5px;
      }
    `
    ]
})
export class EditCustomerDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    customer: CustomerDto = new CustomerDto();
    permissions: PermissionDto[] = [];
    grantedPermissionNames: string[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    customerGroups: CustomerGroupDto[] = [];

    constructor(
        injector: Injector,
        private _customerService: CustomerServiceProxy,
        private _customerGroupService: CustomerGroupServiceProxy,
        private _dialogRef: MatDialogRef<EditCustomerDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._customerGroupService.getAll('', 0, 100).subscribe(cg => {
            this.customerGroups = cg.items;
        });
        this._customerService
            .get(this._id)
            .subscribe((result: CustomerDto) => {
                this.customer.init(result);

                //_.map(result.permissions, item => {
                //  const permission = new PermissionDto();
                //  permission.init(item);
                //  this.permissions.push(permission);
                //});
                //this.grantedPermissionNames = result.grantedPermissionNames;
                //this.setInitialPermissionsStatus();
            });
    }

    setInitialPermissionsStatus(): void {
        _.map(this.permissions, item => {
            this.checkedPermissionsMap[item.name] = this.isPermissionChecked(
                item.name
            );
        });
    }

    isPermissionChecked(permissionName: string): boolean {
        return _.includes(this.grantedPermissionNames, permissionName);
    }

    onPermissionChange(permission: PermissionDto, $event: MatCheckboxChange) {
        this.checkedPermissionsMap[permission.name] = $event.checked;
    }

    getCheckedPermissions(): string[] {
        const permissions: string[] = [];
        _.forEach(this.checkedPermissionsMap, function (value, key) {
            if (value) {
                permissions.push(key);
            }
        });
        return permissions;
    }

    save(): void {
        this.saving = true;

        //this.item.grantedPermissions = this.getCheckedPermissions();

        this._customerService
            .update(this.customer)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close(true);
            });
    }

    close(result: any): void {
        this._dialogRef.close(result);
    }
}
