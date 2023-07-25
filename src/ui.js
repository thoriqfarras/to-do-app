import Todolist from './todolist.js';
import Storage from './storage.js';
import Sidebar from './components/sidebar.js';
import Main from './components/main-content.js';
import ActionBtn from './components/actionBtn.js';
import { PopupTask, PopupProject, PopupDelete } from './components/popup.js';
import { format } from 'date-fns';
import './style.css';

export default function App() {
  
  const todolist = Todolist();  
  const app = document.createElement('div');
  app.classList.add('app');
  document.body.appendChild(app);

  let projects = todolist.projects;
  let activeProject = projects[0];
  let projectBeingEdited = {};
  let taskDisplayed = {};
  let popupDisplayed = {};
  let markedTasks = [];
  
  todolist.addTask({ title: 'mop the floor', priority: 2 });
  todolist.addProject("Groceries");
  todolist.addTask({ title: 'mop the garage', priority: 1, project: 'Chores' });
  
  const sidebar = Sidebar(projects);
  const main = Main(activeProject);
  const actionBtn = ActionBtn();
  const popupTask = PopupTask(projects);
  const popupProject = PopupProject();
  const popupDelete = PopupDelete();
  
  app.appendChild(sidebar.sidebar);
  app.appendChild(main.main);
  app.appendChild(actionBtn.wrapper);
  
  sidebar.sidebar.addEventListener('click', clickHandlerSidebar);
  main.main.addEventListener('click', clickHandlerMain);
  actionBtn.wrapper.addEventListener('click', clickHandlerActionBtn);
  popupTask.popup.addEventListener('click', clickHandlerTaskPopup);
  popupProject.popup.addEventListener('click', clickHandlerPopupProject);
  popupDelete.popup.addEventListener('click', clickHanlderDeletePopup);
  
  // event handlers
  function clickHandlerSidebar(e) {
    if (e.target.id === 'toggle-sidebar') {
      this.classList.toggle('opened');
      this.classList.toggle('closed');
    } else if (e.target.classList.contains('project-item')) {
      if (markedTasks) {
        todolist.removeAllDoneTasks();
        markedTasks = [];
      }
      const targetProjectName = e.target.querySelector('p').innerText;
      const targetProject = projects.find(project => project.title == targetProjectName);
      if (activeProject != targetProject) {
        if (targetProject.title === 'Today') {
          todolist.updateToday();
        } else if (targetProject.title === 'Next 7 days') {
          todolist.updateNextWeek();
        }
        activeProject = targetProject;
        main.loadProject(activeProject);
      }
    } else if (e.target.id === 'edit-proj-btn') {
      const projectNameBeingEdited = e.target.parentElement.innerText;
      projectBeingEdited = todolist.getProjects().find(project => project.title == projectNameBeingEdited);
      popupProject.toggle('edit');
      popupProject.fillTitleField(projectNameBeingEdited);
      app.appendChild(popupProject.popup);
      popupDisplayed = popupProject.popup;
      popupProject.popup.querySelector('input').focus();
    } else if (e.target.id === 'delete-proj-btn') {
      const projectNameBeingEdited = e.target.parentElement.innerText;
      projectBeingEdited = todolist.getProjects().find(project => project.title == projectNameBeingEdited);
      popupDelete.setMode('project', projectBeingEdited);
      app.appendChild(popupDelete.popup);
      popupDisplayed = popupDelete.popup;
    } else if (e.target.classList.contains('project-color')) {
      e.target.addEventListener('change', changeProjectColor);
    }
  }
  
  function clickHandlerActionBtn(e) {
    if (e.target.classList.contains('plus')) {
      actionBtn.toggle();
    } else if (e.target.classList.contains('task')) {
      resetFormFields(popupTask.popup);
      popupTask.toggle('add');
      app.appendChild(popupTask.popup);
      popupDisplayed = popupTask.popup;
      if (
        activeProject.title === 'Logbook' || 
        activeProject.title === "Next 7 days"
      ) {
        fillFormFieldsWithTaskInfo(popupTask.popup, { project: 'Inbox' });
      } else if (activeProject.title === "Today") {
        fillFormFieldsWithTaskInfo(popupTask.popup, { due: format(new Date(), 'yyyy-MM-dd'), project: 'Inbox' });
      } else {
        fillFormFieldsWithTaskInfo(popupTask.popup, { project: activeProject.title });
      }
      popupTask.popup.querySelector('input').focus();
    } else if (e.target.classList.contains('project')) {
      resetFormFields(popupProject.popup);
      popupProject.toggle('add');
      app.appendChild(popupProject.popup);
      popupDisplayed = popupProject.popup;
      popupProject.popup.querySelector('input').focus();
    }
  }
  
  function listenForPopupClose(e) {
    if (e.target.id === 'cancel-btn' || e.target.classList.contains('overlay')) {
      popupDisplayed.remove();
      popupDisplayed = {};
    }
  }
  
  function clickHandlerPopupProject(e) {
    listenForPopupClose(e);
    popupProject.clearWarningMessage();
    let state = this.querySelector('.popup').className.replace('popup ', '');
    if (e.target.id === 'commit-btn') {
      const projectNameField = this.querySelector('input');
      if (state === 'add') {
        const success = todolist.addProject(projectNameField.value);
        if (success === 1) {
          sidebar.loadProjectList(projects);
          popupTask.updateProjectOptions();
          this.remove();
          popupDisplayed = {};
        } else {
          popupProject.loadWarningMessage(success, projectNameField, projectNameField.value);
        }
      } else if (state === "edit") {
        const success = todolist.editProject(projectBeingEdited, projectNameField.value);
        if (success === 1) {
          sidebar.loadProjectList(projects);
          this.remove();
          popupDisplayed = {};
          if (activeProject === projectBeingEdited) main.loadProject(activeProject);
          popupTask.updateProjectOptions();
        } else {
          popupProject.loadWarningMessage(success, projectNameField, projectNameField.value);
        }
      }
    }
  }
  
  function clickHandlerTaskPopup(e) {
    listenForPopupClose(e);
    popupTask.clearWarningMessage();
    const formElements = getAllFormElements(this);
    let state = this.querySelector('.popup').className.replace('popup ', '');
    if (e.target.id === 'commit-btn') {
      const formValues = getAllFormValues(formElements);
      if (state === 'add') {
        const success = todolist.addTask(extractTaskInfo(formValues));
        if (success === 1) {
          main.loadProject(activeProject);
          this.remove();
          popupDisplayed = {};
        } else {
          const taskTitleField = this.querySelector('input');
          popupTask.loadWarningMessage(success, taskTitleField);
        }
      } else if (state === 'edit') {
        const success = todolist.editTask(taskDisplayed, extractTaskInfo(formValues));
        if (success === 1) {
          main.loadProject(activeProject);
          this.remove();
          popupDisplayed = {};
          taskDisplayed = {};
        } else {
          const taskTitleField = this.querySelector('input');
          popupTask.loadWarningMessage(success, taskTitleField);
        }
      }
    } else if (e.target.id === 'edit-task-btn') {
      popupTask.toggle('edit');
      state = this.firstChild.className.replace('popup ', '');
    } else if (e.target.value === 'add-new') {
      this.remove();
      resetFormFields(popupProject.popup);
      popupProject.toggle('add');
      app.appendChild(popupProject.popup);
      popupDisplayed = popupProject.popup;
    } else if (e.target.id === 'delete-task-btn') {
      popupDelete.setMode('task', taskDisplayed);
      popupDisplayed.remove();
      app.appendChild(popupDelete.popup);
      popupDisplayed = popupDelete.popup;
    }
  }
  
  function clickHanlderDeletePopup(e) {
    listenForPopupClose(e);
    if (e.target.id === 'commit-btn') {
      const mode = this.firstChild.className.replace('popup ', '');
      if (mode === 'task') {
        todolist.removeTask(taskDisplayed);
        app.removeChild(popupDisplayed);
        main.loadProject(activeProject);
        taskDisplayed = {};
      } else if (mode === 'project') {
        todolist.removeProject(projectBeingEdited);
        app.removeChild(popupDisplayed);
        if (projectBeingEdited === activeProject) {
          main.loadProject(projects[0]);
        }
        sidebar.loadProjectList(projects);
        projectBeingEdited = {};
      }
    }
  }
  
  function clickHandlerMain(e) {
    if (e.target.classList.contains('task-item')) {
      const taskId = +e.target.dataset.id;
      const selectedTask = todolist.getTaskById(taskId);
      taskDisplayed = selectedTask;
      popupTask.toggle('overview');
      fillFormFieldsWithTaskInfo(popupTask.popup, selectedTask);
      app.appendChild(popupTask.popup);
      popupDisplayed = popupTask.popup;
    } else if (e.target.type === 'checkbox') {
      const taskId = +e.target.parentElement.dataset.id;
      const selectedTask = todolist.getTaskById(taskId);
      if (selectedTask.status === 'todo') {
        selectedTask.status = 'done';
        markedTasks.push();
      } else {
        selectedTask.status = 'todo';
        markedTasks.splice(markedTasks.indexOf(selectedTask), 1);
      }
    }
  }

  // form controls  
  function getAllFormElements(source) {
    return source.querySelectorAll('input, select, textarea');
  }
  
  function getAllFormValues(formElements) {
    let obj = {};
    formElements.forEach((element) => {
      const key = element.id;
      let value = element.value;
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
  
  function fillFormFieldsWithTaskInfo(popup, { ...taskInfo }) {
    const statusIndicator = popup.querySelector('#task-status');
    const titleField = popup.querySelector('#task-title'); 
    const projectField = popup.querySelector('#task-project'); 
    const dueField = popup.querySelector('#task-due'); 
    const priorityField = popup.querySelector('#task-priority'); 
    const noteField = popup.querySelector('#task-note'); 
    if (statusIndicator) {
      statusIndicator.value = taskInfo.status;
      if (taskInfo.status === 'todo') {
        statusIndicator.style.color = "red";
      } else {
        statusIndicator.style.color = "green";
      }
    }
    titleField.value = taskInfo.title || '';
    projectField.value = taskInfo.project || '';
    dueField.value = taskInfo.due || '';
    if (taskInfo.priority) {
      priorityField.value = taskInfo.priority;
    } else {
      priorityField.selectedIndex = 0;
    } 
    noteField.value = taskInfo.note || '';
  }
  
  function extractTaskInfo(formValues) {
    const extracted = {};
    for (let [key, value] of Object.entries(formValues)) {
      const newKey = key.substring(5);
      extracted[newKey] = formValues[key];
    }
    return extracted;
  }

  // others
  function changeProjectColor(e) {
    const circle = e.target.previousSibling;
    const projectName = e.target.nextSibling.innerText;
    const project = projects.find(p => p.title === projectName);
    circle.style.backgroundColor = e.target.value;
    project.edit({ color: e.target.value })
    if (project === activeProject || activeProject.title === 'Logbook') {
      main.loadProject(activeProject);
    }
  }
}