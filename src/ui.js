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
  let taskDisplayed = {};
  let taskBeingEdited = {};
  
  todolist.addTask({ title: 'mop the floor', priority: 2 });
  todolist.addProject("Groceries");
  todolist.addTask({ title: 'mop the garage', priority: 1, project: 'Chores' });
  
  const sidebar = Sidebar(projects);
  const main = Main(activeProject);
  const actionBtn = ActionBtn();
  const popupTask = PopupTask(projects);
  const popupProject = PopupProject();
  
  app.appendChild(sidebar.sidebar);
  app.appendChild(main.main);
  app.appendChild(actionBtn.wrapper);
  
  clickHandlerSidebar(sidebar.sidebar);
  clickHandlerMain(main.main);
  clickHandlerActionBtn(actionBtn);
  clickHandlerPopup(popupTask, sidebar);
  clickHandlerPopup(popupProject, sidebar);
  
  console.log(projects);
  console.log(todolist.getAllTasks());
  
  function clickHandlerSidebar(sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.id === 'toggle-sidebar') {
        sidebar.classList.toggle('opened');
        sidebar.classList.toggle('closed');
      } else if (e.target.classList.contains('project-item')) {
        const targetProjectName = e.target.querySelector('p').innerText;
        const targetProject = projects.find(project => project.name == targetProjectName);
        if (activeProject != targetProject) {
          activeProject = targetProject;
          main.loadProject(activeProject);
        }
      } else if (e.target.id === 'edit-proj-btn') {
        const projectNameBeingEdited = e.target.parentElement.innerText;
        projectBeingEdited = todolist.getProjects().find(project => project.name == projectNameBeingEdited);
        popupProject.toggle('edit');
        popupProject.fillTitleField(projectNameBeingEdited);
        app.appendChild(popupProject.popup);
        popupProject.popup.querySelector('input').focus();
      } else if (e.target.classList.contains('project-color')) {
        e.target.addEventListener('change', changeProjectColor);
      }
    });
    
    function changeProjectColor(e) {
      const circle = e.target.previousSibling;
      const projectName = e.target.nextSibling.innerText;
      const project = projects.find(p => p.name === projectName);
      circle.style.backgroundColor = e.target.value;
      project.color = e.target.value;
    }
  }
  
  function clickHandlerActionBtn(actionBtn) {
    const { wrapper: buttons } = actionBtn;
    buttons.addEventListener('click', e => {
      if (e.target.classList.contains('plus')) {
        actionBtn.toggle();
      } else if (e.target.classList.contains('task')) {
        resetFormFields(popupTask.popup);
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
      let state = popupInstance.getState();
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
              popupInstance.loadWarningMessage(success, projectNameField, projectNameField.value);
            }
          } else if (state === "edit") {
            const success = todolist.editProject(projectBeingEdited, projectNameField.value);
            if (success === 1) {
              sidebar.loadProjectList(projects);
              popup.remove();
              if (activeProject === projectBeingEdited) main.loadProject(activeProject);
            } else {
              popupInstance.loadWarningMessage(success, projectNameField, projectNameField.value);
            }
          }
        } else if (popupType === 'popup-task') {
          const formElements = getAllFormElements(popup);
          const formValues = getAllFormValues(formElements);
          console.log(formValues);
          if (state === 'add') {
            const success = todolist.addTask(extractTaskInfo(formValues));
            if (success === 1) {
              main.loadProject(activeProject);
              popup.remove();
            } else {
              const taskTitleField = popup.querySelector('input');
              popupInstance.loadWarningMessage(success, taskTitleField);
            }
          } else if (state === 'edit') {
            const success = todolist.editTask(taskDisplayed, extractTaskInfo(formValues));
            if (success === 1) {
              main.loadProject(activeProject);
              popup.remove();
              taskDisplayed = {};
            } else {
              const taskTitleField = popup.querySelector('input');
              popupInstance.loadWarningMessage(success, taskTitleField);
            }
          }
        }
      } else if (e.target.id === 'edit-task-btn') {
        popupInstance.toggle('edit');
        state = popupInstance.getState();
        console.log(state);
      }
    });
  }

  function clickHandlerMain(main) {
    main.addEventListener('click', (e) => {
      console.log(e.target);
      if (e.target.classList.contains('task-item')) {
        const taskId = +e.target.dataset.id;
        const selectedTask = todolist.getTaskById(taskId);
        taskDisplayed = selectedTask;
        popupTask.toggle('overview');
        fillFormFields(popupTask.popup, selectedTask);
        app.appendChild(popupTask.popup);
        console.log(selectedTask);
      } else if (e.target.type === 'checkbox') {
        const taskId = +e.target.parentElement.dataset.id;
        const selectedTask = todolist.getTaskById(taskId);
        if (selectedTask.status === 'todo') {
          selectedTask.status = 'done';
        } else {
          selectedTask.status = 'todo';
        }
      }
    });
  }

  function getAllFormElements(source) {
    return source.querySelectorAll('input, select, textarea');
  }

  function getAllFormValues(formElements) {
    let obj = {};
    formElements.forEach((element) => {
      const key = element.id;
      const value = element.value;
      obj[key] = value;
    });
    return obj;
  }

  function resetFormFields(popup) {
    popup.querySelectorAll('input, select, textarea').forEach(field => {
      if (field.type === 'select-one') {
        field.selectedIndex = 0;
      } else {
        field.value = '';
      }
    });
  }

  function fillFormFields(popup, task) {
    const statusIndicator = popup.querySelector('#task-status');
    const titleField = popup.querySelector('#task-title'); 
    const projectField = popup.querySelector('#task-project'); 
    const dueField = popup.querySelector('#task-due'); 
    const priorityField = popup.querySelector('#task-priority'); 
    const noteField = popup.querySelector('#task-note'); 
    statusIndicator.value = task.status;
    if (task.status === 'todo') {
      statusIndicator.style.color = "red";
    } else {
      statusIndicator.style.color = "green";
    }
    titleField.value = task.title;
    projectField.value = task.project;
    dueField.value = task.due;
    priorityField.value = task.priority;
    noteField.value = task.note;
  }

  function extractTaskInfo(formValues) {
    const extracted = {};
    for (let [key, value] of Object.entries(formValues)) {
      const newKey = key.substring(5);
      extracted[newKey] = formValues[key];
    }
    return extracted;
  }
}