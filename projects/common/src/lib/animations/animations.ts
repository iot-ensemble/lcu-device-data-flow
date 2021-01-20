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
  transition('open <=> close', animate('500ms ease-in-out')),
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

// export const onMainContentChange = trigger('onMainContentChange', [
//   state('close',
//     style({
//       'margin-left': '62px'
//     })
//   ),
//   state('open',
//     style({
//       'margin-left': '200px'
//     })
//   ),
//   transition('close => open', animate('250ms ease-in-out')),
//   transition('open => close', animate('250ms ease-in-out')),
// ]);

export const AnimateText = trigger('animateText', [
  state('hide',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state('show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition('close => open', animate('350ms ease-in')),
  transition('open => close', animate('200ms ease-out')),
]);