import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MatCheckboxChange } from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
    ItemServiceProxy,
    ItemPriceServiceProxy,
    ItemDto,
    ItemPriceDto,
    ListResultDtoOfPermissionDto,
    PermissionDto,
    CreateItemDto
} from '@shared/service-proxies/service-proxies';

export interface ItemType {
    id: number;
    value: string;
}

@Component({
    templateUrl: 'create-Item-dialog.component.html',
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
export class CreateItemDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    isHidden = true;
    item: ItemDto = new ItemDto();
    ItemPrices: ItemPriceDto[] = [];
    permissions: PermissionDto[] = [];
    grantedPermissionNames: string[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    defaultPermissionCheckedStatus = true;
    itemTypes: ItemType[] = [
        { id: 0, value: 'Standard' },
        { id: 1, value: 'Time Based' },
        { id: 2, value: 'Period Based' },
    ];

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _dialogRef: MatDialogRef<CreateItemDialogComponent>
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //const priceDto = new ItemPriceDto();
        //priceDto.price = 3;
        //this.ItemPrices.push(priceDto);
        //this._itemService
        //  .getAllPermissions()
        //  .subscribe((result: ListResultDtoOfPermissionDto) => {
        //    this.permissions = result.items;
        //    this.setInitialPermissionsStatus();
        //  });
    }

    setInitialPermissionsStatus(): void {
        _.map(this.permissions, item => {
            this.checkedPermissionsMap[item.name] = this.isPermissionChecked(
                item.name
            );
        });
    }

    isPermissionChecked(permissionName: string): boolean {
        // just return default permission checked status
        // it's better to use a setting
        return this.defaultPermissionCheckedStatus;
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

        //this.role.grantedPermissions = this.getCheckedPermissions();
        debugger;
        const item_ = new CreateItemDto();
        
        item_.init(this.item);
        item_.itemPrices = this.ItemPrices;

        this._itemService
            .create(item_)
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

    createItemPrice(): void {

        const itemPrice = new ItemPriceDto();
       
        this.ItemPrices.push(itemPrice);
       
    }
}
