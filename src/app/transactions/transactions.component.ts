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
    CombinedItemDto,

} from '@shared/service-proxies/service-proxies';
import { debug } from 'util';
import { EditTransactionDialogComponent } from './edit-transaction/edit-transaction-dialog.component';
import { SearchItemsDialogComponent } from './../items/search-item/search-item-dialog.component';
import { SearchCustomerDialogComponent } from '../customers/search-customer/search-customer-dialog.component';
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

          .button {
              display: none;
          }
          
          .wrapper:hover + .button, .button:hover {
              display: inline-block;
          }
        `
    ]
})
export class TransactionsComponent extends PagedListingComponentBase<TransactionDto> {
    trans: TransactionDto[] = [];
    transaction: CreateTransactionDto = new CreateTransactionDto();
    keyword = '';
    interval: any;

    constructor(
        injector: Injector,
        private _tranService: TransactionServiceProxy,
        private _dialog: MatDialog,
        private _itemService: ItemServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.refreshData();
        this.interval = setInterval(() => {
            this.refreshData();
        }, 50000);
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
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
        debugger;
        this._tranService
            .create(this.transaction)
            .pipe(
                finalize(() => {
                    //this.saving = false;
                })
            )
            .subscribe(s => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.trans.unshift(s);
                this.transaction = new TransactionDto();
            });
    }

    focusOutFunction(): void {
        if (this.transaction.itemPriceCode === "") {
            alert("ItemCode cannot be emty");
        } else {
            this._tranService.getItemPrice(this.transaction.itemPriceCode)
                .pipe(
                    finalize(() => {
                        //finishedCallback();
                    })
                )
                .subscribe((result: CreateTransactionDto) => {

                    this.transaction.bufferDuration = result.bufferDuration;
                    this.transaction.description = result.description;
                    this.transaction.itemPriceCode = result.itemPriceCode;
                    this.transaction.itemPriceId = result.itemPriceId;
                    this.transaction.price = result.price;
                    this.transaction.duration = result.duration;
                    this.transaction.state = result.state;
                    this.transaction.durationStr = result.durationStr;
                    this.transaction.isUnlimited = result.isUnlimited;
                });
        }
    }

    focusOutCustomerFunction(): void {
        if (this.transaction.customerName !== "") {

        }
    }

    refreshData() {
        this._tranService
            .getAll("", 0, 20)
            .pipe(
                finalize(() => {

                })
            )
            .subscribe((result: PagedResultDtoOfTransactionDto) => {
                this.trans = result.items;
            });
    }

    finishItem(e): void {
        var ind = this.trans.indexOf(e);
        var tranDto = e;
        tranDto.state = 1;
        this._tranService.finishItem(tranDto.id).subscribe((result: void) => {

            this.trans.splice(ind, 1);
        });

    }

    editItem(tran: TransactionDto): void {
        this.showCreateOrEditItemDialog(tran.id);
    }

    showCreateOrEditItemDialog(id?: number): void {
        let createOrEditItemDialog;
        {
            createOrEditItemDialog = this._dialog.open(EditTransactionDialogComponent, {
                data: id
            });
        }

        createOrEditItemDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }

    showSearchItemDialog(filter: string): void {
        debugger;
        let searchDialog;
        {
            searchDialog = this._dialog.open(SearchItemsDialogComponent, { data: filter });
        }

        searchDialog.afterClosed().subscribe(result => {
            if (result) {
                this.transaction.itemPriceCode = result.priceCode;
                this.focusOutFunction();
            }
        });
    }

    showSearchCustomerDialog(filter: string): void {
        debugger;
        let customerDialog;
        {
            customerDialog = this._dialog.open(SearchCustomerDialogComponent, { data: filter });
        }
        customerDialog.afterClosed().subscribe(result => {
            if (result) {
                this.transaction.customerName = result.firstName + " " + result.lastName;
                this.transaction.phoneNumber = result.phoneNumber;
                this.transaction.customerId = result.id;
            }
        })
    }


}
