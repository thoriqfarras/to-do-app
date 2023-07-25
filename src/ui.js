import Todolist from './todolist';
import Sidebar from './components/sidebar.js';
import Main from './components/main-content.js';
import ActionBtn from './components/actionBtn.js';
import Popup, { PopupTask, PopupProject, PopupDelete } from './components/popup.js';
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
  let popupDisplayed = {};
  
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
      fillFormFieldsWithTaskInfo(popupTask.popup, { project: activeProject.title })
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
    let state = this.firstChild.className.replace('popup ', '');
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
    const formValues = getAllFormValues(formElements);
    let state = this.firstChild.className.replace('popup ', '');
    if (e.target.id === 'commit-btn') {
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
      todolist.removeTask(taskDisplayed);
      app.removeChild(popupDisplayed);
      main.loadProject(activeProject);
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
// function clickHandlerSidebarOld(sidebar) {
  //   sidebar.addEventListener('click', (e) => {
  //     if (e.target.id === 'toggle-sidebar') {
  //       sidebar.classList.toggle('opened');
  //       sidebar.classList.toggle('closed');
  //     } else if (e.target.classList.contains('project-item')) {
  //       const targetProjectName = e.target.querySelector('p').innerText;
  //       const targetProject = projects.find(project => project.title == targetProjectName);
  //       if (activeProject != targetProject) {
  //         if (targetProject.title === 'Today') {
  //           todolist.updateToday();
  //         } else if (targetProject.title === 'Next 7 days') {
  //           todolist.updateNextWeek();
  //         }
  //         activeProject = targetProject;
  //         main.loadProject(activeProject);
  //       }
  //     } else if (e.target.id === 'edit-proj-btn') {
  //       const projectNameBeingEdited = e.target.parentElement.innerText;
  //       projectBeingEdited = todolist.getProjects().find(project => project.title == projectNameBeingEdited);
  //       popupProject.toggle('edit');
  //       popupProject.fillTitleField(projectNameBeingEdited);
  //       app.appendChild(popupProject.popup);
  //       popupDisplayed = popupProject.popup;
  //       popupProject.popup.querySelector('input').focus();
  //     } else if (e.target.classList.contains('project-color')) {
  //       e.target.addEventListener('change', changeProjectColor);
  //     }
  //   });
  // }
// function clickHandlerActionBtnOld(actionBtn) {
  //   const { wrapper: buttons } = actionBtn;
  //   buttons.addEventListener('click', e => {
  //     if (e.target.classList.contains('plus')) {
  //       actionBtn.toggle();
  //     } else if (e.target.classList.contains('task')) {
  //       resetFormFields(popupTask.popup);
  //       popupTask.toggle('add');
  //       app.appendChild(popupTask.popup);
  //       popupDisplayed = popupTask.popup;
  //       fillFormFieldsWithTaskInfo(popupTask.popup, { project: activeProject.title })
  //       popupTask.popup.querySelector('input').focus();
  //     } else if (e.target.classList.contains('project')) {
  //       resetFormFields(popupProject.popup);
  //       popupProject.toggle('add');
  //       app.appendChild(popupProject.popup);
  //       popupDisplayed = popupProject.popup;
  //       popupProject.popup.querySelector('input').focus();
  //     }
  //   });
  // }
// function clickHandlerPopup(popupInstance, sidebar) {
  //   const popup = popupInstance.popup;
  //   const popupType = popup.firstChild.id;
  //   popup.addEventListener('click', (e) => {
  //     let state = popupInstance.getState();
  //     popupInstance.clearWarningMessage();
  //     if (e.target.id === 'cancel-btn' || e.target.classList.contains('overlay')) {
  //       popupDisplayed.remove();
  //       popupDisplayed = {};
  //     } else if (e.target.id === 'commit-btn') {
  //       if (popupType === 'popup-project') {
  //         console.log(state);
  //         const projectNameField = popup.querySelector('input');
  //         if (state === 'add') {
  //           const success = todolist.addProject(projectNameField.value);
  //           if (success === 1) {
  //             sidebar.loadProjectList(projects);
  //             popupTask.updateProjectOptions();
  //             popup.remove();
  //           } else {
  //             popupInstance.loadWarningMessage(success, projectNameField, projectNameField.value);
  //           }
  //         } else if (state === "edit") {
  //           const success = todolist.editProject(projectBeingEdited, projectNameField.value);
  //           if (success === 1) {
  //             sidebar.loadProjectList(projects);
  //             popup.remove();
  //             if (activeProject === projectBeingEdited) main.loadProject(activeProject);
  //             popupTask.updateProjectOptions();
  //           } else {
  //             popupInstance.loadWarningMessage(success, projectNameField, projectNameField.value);
  //           }
  //         }
  //       } else if (popupType === 'popup-task') {
  //         const formElements = getAllFormElements(popup);
  //         const formValues = getAllFormValues(formElements);
  //         console.log(formValues);
  //         if (state === 'add') {
  //           const success = todolist.addTask(extractTaskInfo(formValues));
  //           if (success === 1) {
  //             main.loadProject(activeProject);
  //             popup.remove();
  //           } else {
  //             const taskTitleField = popup.querySelector('input');
  //             popupInstance.loadWarningMessage(success, taskTitleField);
  //           }
  //         } else if (state === 'edit') {
  //           const success = todolist.editTask(taskDisplayed, extractTaskInfo(formValues));
  //           if (success === 1) {
  //             main.loadProject(activeProject);
  //             popup.remove();
  //             taskDisplayed = {};
  //           } else {
  //             const taskTitleField = popup.querySelector('input');
  //             popupInstance.loadWarningMessage(success, taskTitleField);
  //           }
  //         }
  //       } else if (popupType === 'popup-delete') {
  //         todolist.removeTask(taskDisplayed);
  //         app.removeChild(popupDisplayed);
  //         main.loadProject(activeProject);
  //       }
  //     } else if (e.target.id === 'edit-task-btn') {
  //       popupInstance.toggle('edit');
  //       state = popupInstance.getState();
  //       console.log(state);
  //     } else if (e.target.value === 'add-new') {
  //       popup.remove();
  //       resetFormFields(popupProject.popup);
  //       popupProject.toggle('add');
  //       app.appendChild(popupProject.popup);
  //     } else if (e.target.id === 'delete-task-btn') {
  //       popupDelete.setMode('task', taskDisplayed);
  //       popupDisplayed.remove();
  //       app.appendChild(popupDelete.popup);
  //       popupDisplayed = popupDelete.popup;
  //     }
  //   });
  // }

// function clickHandlerMainOld(main) {
  //   main.addEventListener('click', (e) => {
  //     console.log(e.target);
  //     if (e.target.classList.contains('task-item')) {
  //       const taskId = +e.target.dataset.id;
  //       const selectedTask = todolist.getTaskById(taskId);
  //       taskDisplayed = selectedTask;
  //       popupTask.toggle('overview');
  //       fillFormFieldsWithTaskInfo(popupTask.popup, selectedTask);
  //       app.appendChild(popupTask.popup);
  //       popupDisplayed = popupTask.popup;
  //       console.log(selectedTask);
  //     } else if (e.target.type === 'checkbox') {
  //       const taskId = +e.target.parentElement.dataset.id;
  //       const selectedTask = todolist.getTaskById(taskId);
  //       if (selectedTask.status === 'todo') {
  //         selectedTask.status = 'done';
  //       } else {
  //         selectedTask.status = 'todo';
  //       }
  //     }
  //   });
  // }