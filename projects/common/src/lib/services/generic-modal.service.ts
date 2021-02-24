import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ComponentRef, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericModalModel } from '../models/generice-modal.model';

@Injectable({
  providedIn: 'root'
})

// TODO: May need to create a unique ID to isolate and
// multiple modals - shannon

/**
 * Service that handles generic modal instantiation and functionality
 */
export class GenericModalService<T> {

  /**
   * Instance of the modal (exposes modal properties)
   */
  public ModalInstance: T;

  /**
   * Reference to the modal
   */
  public ModalComponent: MatDialogRef<T>;

  constructor(protected dialog: MatDialog) { }

  /**
   *
   * @param modalConfig modal configuration
   *
   * open the modal
   */
  public Open(modalConfig: GenericModalModel): void {
    this.ModalComponent = this.dialog.open(modalConfig.Component, {
      data: modalConfig,
      width: modalConfig.Width
    });

    this.ModalInstance = this.ModalComponent.componentInstance;
  }

  /**
   * Close modal
   */
  public Close(val: any): void {
    this.ModalComponent.close(val);
  }


  /**
   * Event after the modal closes
   */
  public OnAction(): Observable<any> {
      return this.ModalComponent.afterClosed().pipe(take(1), map((res: any) => {
        return res;
      }
    ));
  }
}
