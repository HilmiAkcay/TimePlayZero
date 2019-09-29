import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    ItemServiceProxy,
    ItemDto,
    PagedResultDtoOfItemDto
   
} from '@shared/service-proxies/service-proxies';
import { CreateItemDialogComponent } from './create-item/create-item-dialog.component';
import { EditItemDialogComponent } from './edit-item/edit-item-dialog.component';

class PagedItemsRequestDto extends PagedRequestDto {
    keyword: string;
}

@Component({
    templateUrl: './items.component.html',
    animations: [appModuleAnimation()],
    styles: [
        `
          mat-form-field {
            padding: 10px;
          }
        `
    ]
})
export class ItemsComponent extends PagedListingComponentBase<ItemDto> {
    items: ItemDto[] = [];

    keyword = '';

    constructor(
        injector: Injector,
        private _rolesService: ItemServiceProxy,
        private _dialog: MatDialog
    ) {
        super(injector);
    }

    list(
        request: PagedItemsRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;

        this._rolesService
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: PagedResultDtoOfItemDto) => {
                this.items = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    delete(role: ItemDto): void {
        abp.message.confirm(
            this.l('DeleteWarningMessage', role.name),
            (result: boolean) => {
                if (result) {
                    this._rolesService
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

    createItem(): void {
        this.showCreateOrEditItemDialog();
    }

    editItem(role: ItemDto): void {
        this.showCreateOrEditItemDialog(role.id);
    }

    showCreateOrEditItemDialog(id?: number): void {
        let createOrEditItemDialog;
        if (id === undefined || id <= 0) {
            createOrEditItemDialog = this._dialog.open(CreateItemDialogComponent);
        } else {
            createOrEditItemDialog = this._dialog.open(EditItemDialogComponent, {
                data: id
            });
        }

        createOrEditItemDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
