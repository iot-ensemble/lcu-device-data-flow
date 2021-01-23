import {
  trigger,
  state,
  style,
  transition,
  animate
 } from '@angular/animations';

export const OnExpandHorizontal = trigger('OnExpandHorizontal', [
  state('close',
    style({
      'max-width': '35px'
    })
  ),
  state('open',
    style({
      'max-width': '300px'
    })
  ),
  transition('open <=> close', animate('500ms 100ms ease-out')),
]);

export const OnExpandVertical = trigger('OnExpandVertical', [
  state('up',
  style({
    'max-height': '35px'
  })
),
state('down',
  style({
    'max-height': '300px'
  })
),
  transition('up <=> down', animate('500ms ease-in-out')),
]);

export const AnimateOpacity = trigger('AnimateOpacity', [

  state('hide',
    style({
      display: 'none',
      opacity: 0
    })
  ),
  state('show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('hide <=> show', animate('100ms ease-in-out'))
]);