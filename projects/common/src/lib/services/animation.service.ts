import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

    public IsOpen: boolean;

    constructor() {

        this.ExpandToggleChanged = new Subject();
    }

    /**
     * Open/Close sidenav
     */
    public ExpandToggle(): void {

        this.IsOpen = !this.IsOpen;
        console.log('ISOPEN: ', this.IsOpen);

        if (this.Direction.toUpperCase() === 'VERTICAL') {
            const expand: ExpandToggleModel = new ExpandToggleModel();
            expand.Direction = this.Direction;

            this.ExpandToggleChanged.next(expand);
        } else {

            const expand: ExpandToggleModel = new ExpandToggleModel();
            expand.Direction = this.Direction;

           this.ExpandToggleChanged.next(expand);
        }

        this.Direction = this.Direction;
    }

}
