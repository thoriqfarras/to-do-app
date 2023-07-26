import '../style.css';
import PlusSvg from './plus.svg';

export default function ActionBtn() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('util-btns');

  const plusBtn = document.createElement('button');
  plusBtn.classList.add('plus');
  const plusLogo = document.createElement('img');
  plusLogo.setAttribute('src', PlusSvg);
  plusLogo.style.pointerEvents = 'none';
  plusBtn.appendChild(plusLogo);
  wrapper.appendChild(plusBtn);

  const newTaskBtn = document.createElement('button');
  newTaskBtn.classList.add('task');
  newTaskBtn.innerText = 'New Task';

  const newProjectBtn = document.createElement('button');
  newProjectBtn.classList.add('project');
  newProjectBtn.innerText = 'New Project';

  function toggle() {
    if (wrapper.children.length === 1) {
      wrapper.appendChild(newTaskBtn);
      wrapper.appendChild(newProjectBtn);
      return;
    }
    wrapper.removeChild(newTaskBtn);
    wrapper.removeChild(newProjectBtn);
  }

  return { wrapper, toggle };
}
