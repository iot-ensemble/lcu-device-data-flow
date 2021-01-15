import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class SideNavService {

    public Direction: string;
    /**
     * Toggle Event
     */
    public ExpandToggleChanged: Subject<{toggle: boolean, direction: string}>;

    public ExpandHorizontalChanged: Subject<boolean>;

    public ExpandVerticalChanged: Subject<boolean>;

    /**
     * Boolean to open/close sidenav
     */
    public ExpandToggleVal: boolean;

    public ExpandHoizontalToggleVal: boolean;

    public ExpandVerticalToggleVal: boolean;

    constructor() {

        this.ExpandToggleChanged = new Subject();
        this.ExpandHorizontalChanged = new Subject();
        this.ExpandVerticalChanged = new Subject();

        // toggle close on load
        this.ExpandToggleVal = false;
        this.ExpandHoizontalToggleVal = false;
        this.ExpandVerticalToggleVal = false;
    }

    /**
     * Open/Close sidenav
     */
    public ExpandToggle(val: string): void {

        if (val.toUpperCase() === 'VERTICAL') {
            const toggle: boolean = this.ExpandVerticalToggleVal = !this.ExpandVerticalToggleVal;
            this.ExpandToggleChanged.next({toggle: toggle, direction: val});
        } else {
            const toggle: boolean = this.ExpandHoizontalToggleVal = !this.ExpandHoizontalToggleVal;
            this.ExpandToggleChanged.next({toggle: toggle, direction: val});
        }

        this.Direction = val;
    }

}