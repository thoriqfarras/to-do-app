import Todolist from './todolist';
import Sidebar from './components/sidebar.js';
import Main from './components/main-content.js';
import ActionBtn from './components/actionBtn.js';
import { PopupTask, PopupProject } from './components/popup.js';
import './style.css';

export default function App() {
  
  const todolist = Todolist();
  
  const app = document.createElement('div');
  app.classList.add('app');
  document.body.appendChild(app);
  
  let projects = todolist.getProjects();
  let activeProject = projects[0];
  
  todolist.addTask({ name: 'mop the floor', priority: 2 });
  
  const sidebar = Sidebar(projects);
  const main = Main(activeProject);
  const actionBtn = ActionBtn();
  const popupTask = PopupTask(projects);
  const popupProject = PopupProject();
  
  app.appendChild(sidebar.sidebar);
  app.appendChild(main.main);
  app.appendChild(actionBtn.wrapper);
  
  clickHandlerSidebar(sidebar.sidebar);
  clickHandlerActionBtn(actionBtn);
  clickHandlerPopup(popupTask);
  clickHandlerPopup(popupProject);
  // closePopupHandler(popupTask.popup);
  // closePopupHandler(popupProject.popup);

  function clickHandlerSidebar(sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.id === 'toggle-sidebar') {
        sidebar.classList.toggle('opened');
        sidebar.classList.toggle('closed');
      }
    });
  }
  
  function clickHandlerActionBtn(actionBtn) {
    const { wrapper: buttons } = actionBtn;
    buttons.addEventListener('click', e => {
      if (e.target.classList.contains('plus')) {
        actionBtn.toggle();
      } else if (e.target.classList.contains('task')) {
        popupTask.toggle('add');
        app.appendChild(popupTask.popup);
      } else if (e.target.classList.contains('project')) {
        popupProject.toggle('add');
        app.appendChild(popupProject.popup);
      }
    });
  }

  function closePopupHandler(popup) {
    popup.addEventListener('click', (e) => {
      if (e.target.id === 'cancel-btn' || e.target.classList.contains('overlay')) {
        popup.remove();
      }
    });
  }

  function clickHandlerPopup(popupInstance) {
    const popup = popupInstance.popup;
    const popupType = popup.firstChild.id;
    const state = popupInstance.state;
    popup.addEventListener('click', (e) => {
      if (e.target.id === 'cancel-btn' || e.target.classList.contains('overlay')) {
        popup.remove();
      } else if (e.target.id === 'commit-btn') {
        if (popupType === 'popup-project') {
          const projectName = popup.querySelector('input').value;
          console.log(popupInstance.state);
          if (state === 'add') {
            todolist.addProject(projectName);
          }
        }
      }
    });
  }
}