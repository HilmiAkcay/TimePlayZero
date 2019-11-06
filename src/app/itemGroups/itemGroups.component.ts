import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    ItemGroupServiceProxy,
    ItemGroupDto,
    PagedResultDtoOfItemGroupDto
   
} from '@shared/service-proxies/service-proxies';
import { CreateItemGroupDialogComponent } from './create-itemGroup/create-itemGroup-dialog.component';
import { EditItemGroupDialogComponent } from './edit-itemGroup/edit-itemGroup-dialog.component';

class PagedItemGroupsRequestDto extends PagedRequestDto {
    keyword: string;
}

@Component({
    templateUrl: './itemGroups.component.html',
    animations: [appModuleAnimation()],
    styles: [
        `
          mat-form-field {
            padding: 10px;
          }
        `
    ]
})
export class ItemGroupsComponent extends PagedListingComponentBase<ItemGroupDto> {
    itemGroups: ItemGroupDto[] = [];

    keyword = '';

    constructor(
        injector: Injector,
        private _itemGroupService: ItemGroupServiceProxy,
        private _dialog: MatDialog
    ) {
        super(injector);
    }

    list(
        request: PagedItemGroupsRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;

        this._itemGroupService
            .getAll(request.keyword, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
        )
            .subscribe((result: PagedResultDtoOfItemGroupDto) => {
                this.itemGroups = result.items;
                this.showPaging(result, pageNumber);
            });
    }


    delete(role: ItemGroupDto): void {
        abp.message.confirm(
            this.l('DeleteWarningMessage', role.name),
            (result: boolean) => {
                if (result) {
                    this._itemGroupService
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

    createItemGroup(): void {
        this.showCreateOrEditItemGroupDialog();
    }

    editItemGroup(role: ItemGroupDto): void {
        this.showCreateOrEditItemGroupDialog(role.id);
    }

    showCreateOrEditItemGroupDialog(id?: number): void {
        let createOrEditItemGroupDialog;
        if (id === undefined || id <= 0) {
            createOrEditItemGroupDialog = this._dialog.open(CreateItemGroupDialogComponent);
        } else {
            createOrEditItemGroupDialog = this._dialog.open(EditItemGroupDialogComponent, {
                data: id
            });
        }

        createOrEditItemGroupDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
