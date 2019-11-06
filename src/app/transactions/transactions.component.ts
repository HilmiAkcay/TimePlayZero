import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    TransactionServiceProxy,
    TransactionDto,
    PagedResultDtoOfTransactionDto,    CreateTransactionDto,
    ItemServiceProxy,

} from '@shared/service-proxies/service-proxies';
import { debug } from 'util';
//import { CreateItemDialogComponent } from './create-item/create-item-dialog.component';
//import { EditItemDialogComponent } from './edit-item/edit-item-dialog.component';

class PagedItemsRequestDto extends PagedRequestDto {
    keyword: string;
}

@Component({
    templateUrl: './transactions.component.html',
    animations: [appModuleAnimation()],
    styles: [
        `
          mat-form-field {
            padding: 10px;
          }

         .buttonHeader{
  margin: Auto;
 
  padding: 0px;
}
        `
    ]
})
export class TransactionsComponent extends PagedListingComponentBase<TransactionDto> {
    trans: TransactionDto[] = [];
    transaction: CreateTransactionDto = new CreateTransactionDto();
    keyword = '';

    constructor(
        injector: Injector,
        private _tranService: TransactionServiceProxy,
        private _itemService: ItemServiceProxy) {
        super(injector);
    }

    list(
        request: PagedItemsRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;

        this._tranService
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: PagedResultDtoOfTransactionDto) => {
                this.trans = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    delete(role: TransactionDto): void {
        abp.message.confirm(
            this.l('DeleteWarningMessage', role.description),
            (result: boolean) => {
                if (result) {
                    this._tranService
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

    createTransaction(): void {
        this._tranService
            .create(this.transaction)
            .pipe(
                finalize(() => {
                    //this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                //this.close(true);
            });
    }

    focusOutFunction(): void {
        if (this.transaction.itemPriceCode === "") {
            alert("ItemCode cannot be emty");
        } else {
            debugger;
            this._tranService.getItemPrice(this.transaction.itemPriceCode)
                .pipe(
                    finalize(() => {
                        //finishedCallback();
                    })
            )
                .subscribe((result: CreateTransactionDto) => {
                    this.transaction = result;
                });
        }
    }

    //createItem(): void {
    //    this.showCreateOrEditItemDialog();
    //}

    //editItem(role: ItemDto): void {
    //    this.showCreateOrEditItemDialog(role.id);
    //}

    //showCreateOrEditItemDialog(id?: number): void {
    //    let createOrEditItemDialog;
    //    if (id === undefined || id <= 0) {
    //        createOrEditItemDialog = this._dialog.open(CreateItemDialogComponent);
    //    } else {
    //        createOrEditItemDialog = this._dialog.open(EditItemDialogComponent, {
    //            data: id
    //        });
    //    }

    //    createOrEditItemDialog.afterClosed().subscribe(result => {
    //        if (result) {
    //            this.refresh();
    //        }
    //    });
    //}
}
