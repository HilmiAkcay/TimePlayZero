import { Component, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    PagedListingComponentBase,
    PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
    RoleServiceProxy,
    RoleDto,
    PagedResultDtoOfRoleDto
} from '@shared/service-proxies/service-proxies';
import { CreateItemDialogComponent } from './create-item/create-item-dialog.component';
import { EditItemDialogComponent } from './edit-item/edit-item-dialog.component';

class PagedRolesRequestDto extends PagedRequestDto {
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
export class ItemsComponent extends PagedListingComponentBase<RoleDto> {
    roles: RoleDto[] = [];

    keyword = '';

    constructor(
        injector: Injector,
        private _rolesService: RoleServiceProxy,
        private _dialog: MatDialog
    ) {
        super(injector);
    }

    list(
        request: PagedRolesRequestDto,
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
            .subscribe((result: PagedResultDtoOfRoleDto) => {
                this.roles = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    delete(role: RoleDto): void {
        abp.message.confirm(
            this.l('RoleDeleteWarningMessage', role.displayName),
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

    createRole(): void {
        this.showCreateOrEditRoleDialog();
    }

    editRole(role: RoleDto): void {
        this.showCreateOrEditRoleDialog(role.id);
    }

    showCreateOrEditRoleDialog(id?: number): void {
        let createOrEditRoleDialog;
        if (id === undefined || id <= 0) {
            createOrEditRoleDialog = this._dialog.open(CreateItemDialogComponent);
        } else {
            createOrEditRoleDialog = this._dialog.open(EditItemDialogComponent, {
                data: id
            });
        }

        createOrEditRoleDialog.afterClosed().subscribe(result => {
            if (result) {
                this.refresh();
            }
        });
    }
}
