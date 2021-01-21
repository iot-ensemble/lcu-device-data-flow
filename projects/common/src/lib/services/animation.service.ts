import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { ExpandToggleModel } from '../models/expand-toggle.model';

@Injectable({
    providedIn: 'root'
})
export class AnimationService {

    public Direction: string;
    /**
     * Toggle Event
     */
    public ExpandToggleChanged: Subject<ExpandToggleModel>;

    public ExpandHorizontalChanged: Subject<boolean>;

    public ExpandVerticalChanged: Subject<boolean>;

    /**
     * Boolean to open/close sidenav
     */
    // public ExpandToggleVal: boolean;

    public ExpandHoizontalToggleVal: boolean;

    public ExpandVerticalToggleVal: boolean;

    public IsOpen: boolean;

    constructor() {

        this.ExpandToggleChanged = new Subject();
        this.ExpandHorizontalChanged = new Subject();
        this.ExpandVerticalChanged = new Subject();

        // toggle close on load
        // this.ExpandToggleVal = false;
        // this.ExpandHoizontalToggleVal = false;
        // this.ExpandVerticalToggleVal = false;
    }

    /**
     * Open/Close sidenav
     */
    public ExpandToggle(): void {

        this.IsOpen = !this.IsOpen;
        console.log('ISOPEN: ', this.IsOpen);

        if (this.Direction.toUpperCase() === 'VERTICAL') {
            // const toggle: boolean = this.ExpandVerticalToggleVal = !this.ExpandVerticalToggleVal;
            const expand: ExpandToggleModel = new ExpandToggleModel();

            expand.Direction = this.Direction;
            // expand.Toggle = toggle;

            this.ExpandToggleChanged.next(expand);
        } else {
            // const toggle: boolean = this.ExpandHoizontalToggleVal = !this.ExpandHoizontalToggleVal;
            const expand: ExpandToggleModel = new ExpandToggleModel();

            expand.Direction = this.Direction;
            // expand.Toggle = toggle;

           this.ExpandToggleChanged.next(expand);
        }

        this.Direction = this.Direction;
    }

}