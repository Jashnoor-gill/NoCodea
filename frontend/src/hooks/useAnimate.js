import { useState } from 'react';

const ANIMATIONS = {
  fade: {
    enter: 'transition-opacity duration-300 opacity-0',
    enterActive: 'opacity-100',
    leave: 'transition-opacity duration-300 opacity-100',
    leaveActive: 'opacity-0',
  },
  slide: {
    enter: 'transition-transform duration-300 -translate-y-4 opacity-0',
    enterActive: 'translate-y-0 opacity-100',
    leave: 'transition-transform duration-300 translate-y-0 opacity-100',
    leaveActive: '-translate-y-4 opacity-0',
  },
};

export function useAnimate(type = 'fade') {
  const [show, setShow] = useState(false);
  const anim = ANIMATIONS[type] || ANIMATIONS.fade;
  const animateProps = show
    ? `${anim.enter} ${anim.enterActive}`
    : `${anim.leave} ${anim.leaveActive}`;
  return [show, setShow, animateProps];
} 