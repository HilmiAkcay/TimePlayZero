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
    TransactionServiceProxy,
    TransactionDto,
    PagedResultDtoOfTransactionDto,    CreateTransactionDto,
    ItemServiceProxy,

} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: 'edit-transaction-dialog.component.html',
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
export class EditTransactionDialogComponent extends AppComponentBase
    implements OnInit {
    saving = false;
    tran: TransactionDto = new TransactionDto();
   

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _tranService: TransactionServiceProxy,

        private _dialogRef: MatDialogRef<EditTransactionDialogComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private _id: number
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._tranService
            .get(this._id)
            .subscribe((result: TransactionDto) => {
                this.tran.init(result);
                //_.map(result.permissions, item => {
                //  const permission = new PermissionDto();
                //  permission.init(item);
                //  this.permissions.push(permission);
                //});
                //this.grantedPermissionNames = result.grantedPermissionNames;
                //this.setInitialPermissionsStatus();
            });
    }

    save(): void {
        this.saving = true;

        this._tranService
            .update(this.tran)
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
