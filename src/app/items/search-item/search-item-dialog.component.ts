import { Component, Injector, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MatCheckboxChange, MAT_DIALOG_DATA, } from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    ItemServiceProxy,
    ItemDto,
    PermissionDto,
    CombinedItemDto
} from '@shared/service-proxies/service-proxies';
import { debug } from 'util';



@Component({
    templateUrl: './search-item-dialog.component.html',
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
export class SearchItemsDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    isHidden = true;
    item: ItemDto = new ItemDto();
    permissions: PermissionDto[] = [];
    grantedPermissionNames: string[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    defaultPermissionCheckedStatus = true;
    keyword: string;
    items: CombinedItemDto[] = [];

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _dialogRef: MatDialogRef<SearchItemsDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: string
    ) {
        super(injector);
        this.keyword = data
    }



    ngOnInit(): void {

        this.doSearch();
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

    doSearch() {
        this._itemService
            .getCombinedItems(this.keyword)
            .pipe(
                finalize(() => {
                    // finishedCallback();
                })
            )
            .subscribe((result: CombinedItemDto[]) => {
                this.items = result;
            });
    }

    onKeydown(event) {
        if (event.key === "Enter") {
            this.doSearch();
        }
    }

    setClickedRow(i) {
        this.close(i);
    }

    close(result: any): void {
        this._dialogRef.close(result);
    }
}
