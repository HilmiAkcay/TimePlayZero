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
    ItemServiceProxy,
    ItemPriceServiceProxy,
    PermissionDto,
    ItemDto,
    ItemPriceDto,
    ItemEditDto,
    ItemGroupServiceProxy,
    ItemGroupDto,
    PagedResultDtoOfItemGroupDto
    
} from '@shared/service-proxies/service-proxies';

export interface ItemType {
    id: number;
    value: string;
}

@Component({
    templateUrl: 'edit-item-dialog.component.html',
    styles: [
        `
      mat-form-field {
        width: 100%;
      }
      mat-checkbox {
        padding-bottom: 5px;
      }

     .deleteButton{
        padding:0px;
        margin : 0px;
     }
    `
    ]
})
export class EditItemDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    item: ItemEditDto = new ItemEditDto();
    permissions: PermissionDto[] = [];
    itemGroups: ItemGroupDto[] = [];
    grantedPermissionNames: string[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    itemTypes: ItemType[] = [
        { id: 0, value: 'Standard' },
        { id: 1, value: 'Time Based' },
        { id: 2, value: 'Period Based' },
    ];

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _itemGroupService: ItemGroupServiceProxy,
        private _itemPriceService: ItemPriceServiceProxy,

        private _dialogRef: MatDialogRef<EditItemDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._itemService
            .get(this._id)
            .subscribe((result: ItemDto) => {
                this.item.init(result);
                //_.map(result.permissions, item => {
                //  const permission = new PermissionDto();
                //  permission.init(item);
                //  this.permissions.push(permission);
                //});
                //this.grantedPermissionNames = result.grantedPermissionNames;
                //this.setInitialPermissionsStatus();
            });
        this._itemPriceService.getItemPrices(this._id)
            .subscribe((result: ItemPriceDto[]) => {
                this.item.itemPrices = result;
            });
        this._itemGroupService
            .getAll("", 0, 100)
            .pipe(
                finalize(() => {
                    //finishedCallback();
                })
            )
            .subscribe((result: PagedResultDtoOfItemGroupDto) => {
                this.itemGroups = result.items;

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

        this._itemService
            .update(this.item)
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
        
        var itemPrice = new ItemPriceDto();
        itemPrice.itemId = this.item.id;
        itemPrice.uniqueId = Math.random().toString();
        this.item.itemPrices.push(itemPrice);
    }

    deleteItemPrice(itemPrice: ItemPriceDto): void {
        abp.message.confirm(
            this.l('DeleteWarningMessage', itemPrice.price),
            (result: boolean) => {
                if (result) {
                    this._itemPriceService
                        .delete(itemPrice.id)
                        .pipe(
                            finalize(() => {
                                abp.notify.success(this.l('SuccessfullyDeleted'));
                                const index: number = this.item.itemPrices.indexOf(itemPrice);
                                if (index !== -1) {
                                    this.item.itemPrices.splice(index, 1);
                                }   
                            })
                        )
                        .subscribe(() => { });
                }
            }
        );
    }
}
