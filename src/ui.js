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
  let projectBeingEdited = {};
  let taskBeingEdited = {};
  
  todolist.addTask({ name: 'mop the floor', priority: 2 });
  todolist.addProject("Groceries");
  todolist.addTask({ name: 'mop the floor', priority: 2, project: 'Groceries' });
  
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
  clickHandlerPopup(popupTask, sidebar);
  clickHandlerPopup(popupProject, sidebar);

  console.log(todolist.getProjectNames());

  function clickHandlerSidebar(sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.id === 'toggle-sidebar') {
        sidebar.classList.toggle('opened');
        sidebar.classList.toggle('closed');
      } else if (e.target.id === 'edit-proj-btn') {
        const projectNameBeingEdited = e.target.parentElement.innerText;
        projectBeingEdited = todolist.getProjects().find(project => project.name == projectNameBeingEdited);
        popupProject.toggle('edit');
        popupProject.fillTitleField(projectNameBeingEdited);
        app.appendChild(popupProject.popup);
        popupProject.popup.querySelector('input').focus();
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
        popupTask.popup.querySelector('input').focus();
      } else if (e.target.classList.contains('project')) {
        popupProject.toggle('add');
        app.appendChild(popupProject.popup);
        popupProject.popup.querySelector('input').focus();
      }
    });
  }

  function clickHandlerPopup(popupInstance, sidebar) {
    const popup = popupInstance.popup;
    const popupType = popup.firstChild.id;
    popup.addEventListener('click', (e) => {
      popupInstance.clearWarningMessage();
      const state = popupInstance.getState();
      if (e.target.id === 'cancel-btn' || e.target.classList.contains('overlay')) {
        popup.remove();
      } else if (e.target.id === 'commit-btn') {
        if (popupType === 'popup-project') {
          const projectNameField = popup.querySelector('input');
          if (state === 'add') {
            const success = todolist.addProject(projectNameField.value);
            if (success === 1) {
              sidebar.loadProjectList(projects);
              popup.remove();
            } else {
              popupInstance.loadWarningMessage(success, projectNameField.value, projectNameField);
            }
          } else if (state === "edit") {
            const success = todolist.editProject(projectBeingEdited, projectNameField.value);
            if (success === 1) {
              sidebar.loadProjectList(projects);
              popup.remove();
            } else {
              popupInstance.loadWarningMessage(success, projectNameField.value, projectNameField);
            }
          }
        }
      }
    });
  }
}