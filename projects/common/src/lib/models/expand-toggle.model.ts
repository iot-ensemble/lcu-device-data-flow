export class ExpandToggleModel {
    public Toggle: boolean;
    public Direction: string;

    construction(toggle: boolean, direction: string) {
        this.Toggle = toggle;
        this.Direction = direction;
    }
}