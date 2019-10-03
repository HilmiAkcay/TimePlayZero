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
    CustomerGroupServiceProxy,
    GetRoleForEditOutput,
    PermissionDto,
    CustomerGroupDto
} from '@shared/service-proxies/service-proxies';

export interface ItemType {
    id: number;
    value: string;
}

@Component({
    templateUrl: 'edit-customerGroup-dialog.component.html',
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
export class EditCustomerGroupDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    customerGroup: CustomerGroupDto = new CustomerGroupDto();
    permissions: PermissionDto[] = [];
    grantedPermissionNames: string[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    itemTypes: ItemType[] = [
        { id: 0, value: 'Standard' },
        { id: 1, value: 'Time Based' },
    ];

    constructor(
        injector: Injector,
        private _customerGroupService: CustomerGroupServiceProxy,
        private _dialogRef: MatDialogRef<EditCustomerGroupDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._customerGroupService
            .get(this._id)
            .subscribe((result: CustomerGroupDto) => {
                this.customerGroup.init(result);
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

        this._customerGroupService
            .update(this.customerGroup)
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
