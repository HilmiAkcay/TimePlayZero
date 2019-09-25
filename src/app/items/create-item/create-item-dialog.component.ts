import { Component, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MatCheckboxChange } from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ItemServiceProxy,
  ItemDto,
  ListResultDtoOfPermissionDto,
  PermissionDto,
  CreateItemDto
} from '@shared/service-proxies/service-proxies';

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
    item: ItemDto = new ItemDto();
  permissions: PermissionDto[] = [];
  grantedPermissionNames: string[] = [];
  checkedPermissionsMap: { [key: string]: boolean } = {};
  defaultPermissionCheckedStatus = true;

  constructor(
    injector: Injector,
    private _itemService: ItemServiceProxy,
      private _dialogRef: MatDialogRef<CreateItemDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
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
    _.forEach(this.checkedPermissionsMap, function(value, key) {
      if (value) {
        permissions.push(key);
      }
    });
    return permissions;
  }

  save(): void {
    this.saving = true;

    //this.role.grantedPermissions = this.getCheckedPermissions();

      const item_ = new CreateItemDto();
      item_.init(this.item);

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
}
