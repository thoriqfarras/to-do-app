import Todolist from './app';
import InboxSvg from './inbox-outline.svg';
import TodaySvg from './calendar-today-outline.svg';
import WeekSvg from './view-week-outline.svg';
import LogbookSvg from './book-open-outline.svg';
import TaskNoteSvg from './text.svg';
import Flag from './flag-variant.svg';
import GithubSvg from './github.svg';
import PlusSvg from './plus.svg';
import CheckSvg from './check.svg';
import DeleteSvg from './delete-task-icon.svg';
import EditSvg from './edit-task-icon.svg';
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
  const popup = Popup(projects);
  popup.toggle('overview');
  
  app.appendChild(sidebar.sidebar);
  app.appendChild(main.main);
  app.appendChild(actionBtn.wrapper);
  app.appendChild(popup.popup);
  popup.toggle('edit');
  popup.toggle('add');
  popup.toggle('overview');
  popup.toggle('add');

  
  clickHandlerSidebar(sidebar.sidebar);
  clickHandlerActionBtn(actionBtn);
}

// Components

export function Sidebar(projects) {
  const sidebar = document.createElement('nav');
  sidebar.classList.add('sidebar', 'opened');
  
  const hamburger = document.createElement('button');
  hamburger.setAttribute('type', 'button');
  hamburger.setAttribute('id', 'toggle-sidebar');
  hamburger.innerText = '≡';
  sidebar.appendChild(hamburger);
  
  const main = document.createElement('ul');
  main.classList.add('sidebar-main');
  sidebar.appendChild(main);
  
  const title = document.createElement('li');
  const titleText = document.createElement('h1');
  const titleTextSpan = document.createElement('span');
  titleText.innerText = 'Two';
  titleTextSpan.innerText = 'Deux';
  titleTextSpan.style.color = '#7b7f86';
  titleText.appendChild(titleTextSpan);
  title.appendChild(titleText);
  main.appendChild(title);
  
  for (let i = 0; i < 4; i++) {
    const option = document.createElement('li');
    const optionAnchor = document.createElement('a');
    const optionIcon = document.createElement('img');
    const optionText = document.createElement('p');
    switch (i) {
      case 0:
      optionIcon.setAttribute('src', InboxSvg);
      optionIcon.setAttribute('alt', 'inbox icon');
      optionText.innerText = 'Inbox';
      break;
      case 1:
      optionIcon.setAttribute('src', TodaySvg);
      optionIcon.setAttribute('alt', 'today icon');
      optionText.innerText = 'Today';
      break;
      case 2:
      optionIcon.setAttribute('src', WeekSvg);
      optionIcon.setAttribute('alt', 'next week icon');
      optionText.innerText = 'Next 7 days';
      break;
      case 3:
      optionIcon.setAttribute('src', LogbookSvg);
      optionIcon.setAttribute('alt', 'logbook icon');
      optionText.innerText = 'Logbook';
      break;
      default:
      break;
    }
    optionAnchor.appendChild(optionIcon);
    optionAnchor.appendChild(optionText);
    option.appendChild(optionAnchor);
    main.appendChild(option);
  }
  
  const projectList = document.createElement('ul');
  projectList.classList.add('sidebar-main');
  sidebar.appendChild(projectList);
  
  function loadProjectList(projects) {
    for (const project of projects) {
      const circle = document.createElement('div');
      const projectAnchor = document.createElement('a');
      const projectName = document.createElement('p');
      circle.classList.add('circle');
      projectName.innerText = project.name;
      projectAnchor.appendChild(circle);
      projectAnchor.appendChild(projectName);
      projectList.appendChild(projectAnchor);
    }
  }
  
  loadProjectList(projects);
  
  return {
    sidebar,
    loadProjectList,
  };
}

function Main(activeProject) {
  const main = document.createElement('main');
  main.classList.add('main-content');
  
  const pageTitle = document.createElement('h1');
  const tasksList = document.createElement('ul');
  tasksList.classList.add('tasks');
  
  main.appendChild(pageTitle);
  main.appendChild(tasksList);
  
  function loadProject(activeProject) {
    pageTitle.innerText = activeProject.name;
    
    const tasks = activeProject.getTasks();
    tasks.forEach(task => {
      tasksList.appendChild(new TaskItem(task));
    });
  }
  
  loadProject(activeProject);
  main.appendChild(Footer());
  
  return { main, loadProject };
}

function TaskItem(task) {
  const taskItem = document.createElement('li');
  const taskWrapperMain = document.createElement('div');
  const taskWrapperInfo = document.createElement('div');
  taskWrapperMain.classList.add('task-wrapper', 'main');
  taskWrapperInfo.classList.add('task-wrapper', 'info');
  taskItem.appendChild(taskWrapperMain);
  taskItem.appendChild(taskWrapperInfo);
  
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  taskWrapperMain.appendChild(checkBox);
  
  const taskTitle = document.createElement('p');
  taskTitle.innerText = task.name;
  taskWrapperMain.appendChild(taskTitle);
  
  if (task.note) {
    const taskNoteIndicator = document.createElement('img');
    taskNoteIndicator.setAttribute('src', TaskNoteSvg);
    taskNoteIndicator.setAttribute('alt', 'task note icon');
    taskWrapperMain.appendChild(taskNoteIndicator);
  }
  
  const projectTag = document.createElement('span');
  projectTag.classList.add('task-tag', 'project');
  projectTag.innerText = task.project;
  taskWrapperInfo.appendChild(projectTag);
  
  if (task.priority) {
    for (let i = 0; i < task.priority; i++) {
      const priorityTag = document.createElement('img');
      priorityTag.setAttribute('src', Flag);
      priorityTag.setAttribute('alt', 'priority icon');
      taskWrapperInfo.appendChild(priorityTag);
    }
  }
  
  if (task.due) {
    const dateTag = document.createElement('span');
    dateTag.classList.add('task-tag', 'date');
    dateTag.innerText = task.due;
    taskWrapperInfo.appendChild(dateTag);
  }
  
  return taskItem;
}

function Footer() {
  const footer = document.createElement('footer');
  
  const text = document.createElement('p');
  text.innerText = `Copyright \u00A9 Thoriq Farras ${new Date().getFullYear()}`;
  footer.appendChild(text);
  
  const githubIconAnchor = document.createElement('a');
  githubIconAnchor.setAttribute('href', 'https://github.com/thoriqfarras');
  githubIconAnchor.setAttribute('target', '_blank');
  footer.appendChild(githubIconAnchor);
  
  const githubIcon = document.createElement('img');
  githubIcon.setAttribute('src', GithubSvg);
  githubIconAnchor.appendChild(githubIcon);  
  
  return footer;
}

function ActionBtn() {
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

// event handlers

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
  console.log(buttons);
  buttons.addEventListener('click', e => {
    console.log(e.target);
    if (e.target.classList.contains('plus')) {
      actionBtn.toggle();
    }
  });
}

function Popup(projects) {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  
  const popup = document.createElement('ul');
  popup.classList.add('popup', 'task');
  overlay.appendChild(popup);
  
  const title = document.createElement('h2');
  popup.appendChild(title);
  
  for (let i = 0; i < 6; i++) {
    const wrapper = document.createElement('li');
    popup.appendChild(wrapper);
  }
  
  const listItems = popup.querySelectorAll('li');
  
  const taskTitleLabel = document.createElement('label');
  const taskTitle = document.createElement('input');
  taskTitleLabel.innerText = 'Title';
  taskTitleLabel.setAttribute('for', 'task-title');
  taskTitle.setAttribute('type', 'text');
  taskTitle.setAttribute('id', 'task-title');
  listItems[0].appendChild(taskTitleLabel);
  listItems[0].appendChild(taskTitle);
  
  const taskProjectLabel = document.createElement('label');
  const taskProject = document.createElement('select');
  taskProjectLabel.innerText = 'Project';
  taskProjectLabel.setAttribute('for', 'task-project');
  taskProject.setAttribute('name', 'project');
  taskProject.setAttribute('id', 'task-project');
  listItems[1].appendChild(taskProjectLabel);
  listItems[1].appendChild(taskProject);
  
  projects.forEach(project => {
    const projectOption = document.createElement('option');
    projectOption.setAttribute('value', project.name);
    projectOption.innerText = project.name;
    taskProject.appendChild(projectOption);
  });
  
  const taskDueLabel = document.createElement('label');
  const taskDue = document.createElement('input');
  taskDueLabel.innerText = 'Due date';
  taskDueLabel.setAttribute('for', 'task-due');
  taskDue.setAttribute('type', 'date');
  taskDue.setAttribute('id', 'task-due');
  listItems[2].appendChild(taskDueLabel);
  listItems[2].appendChild(taskDue);
  
  const taskPriorityLabel = document.createElement('label');
  const taskPriority = document.createElement('select');
  taskPriorityLabel.innerText = 'Priority';
  taskPriorityLabel.setAttribute('for', 'task-priority');
  taskPriority.setAttribute('name', 'priority');
  taskPriority.setAttribute('id', 'task-priority');
  listItems[3].appendChild(taskPriorityLabel);
  listItems[3].appendChild(taskPriority);
  
  for (let i = 0; i <= 3; i++) {
    const priorityOption = document.createElement('option');
    priorityOption.setAttribute('value', i);
    switch (i) {
      case 0:
      priorityOption.innerText = 'None';
      break;
      case 1:
      priorityOption.innerText = 'Low';
      break;
      case 2:
      priorityOption.innerText = 'Medium';
      break;
      case 3:
      priorityOption.innerText = 'High';
      break;
      default:
      break;
    }
    taskPriority.appendChild(priorityOption);
  }

  const taskNoteLabel = document.createElement('label');
  const taskNote = document.createElement('textarea');
  taskNoteLabel.innerText = 'Note';
  taskNoteLabel.setAttribute('for', 'task-note');
  taskNote.setAttribute('rows', 20);
  taskNote.setAttribute('id', 'task-note');
  listItems[4].appendChild(taskNoteLabel);
  listItems[4].appendChild(taskNote);

  const btnsWrapper = listItems[5];
  const btnOne = document.createElement('button');
  const btnTwo = document.createElement('button');
  const btnThree = document.createElement('button');
  const deleteIcon = document.createElement('img');
  deleteIcon.setAttribute('src', DeleteSvg);
  deleteIcon.setAttribute('alt', 'delete task icon');
  const checkIcon = document.createElement('img');
  checkIcon.setAttribute('src', CheckSvg);
  checkIcon.setAttribute('alt', 'check icon');
  const editIcon = document.createElement('img');
  editIcon.setAttribute('src', EditSvg);
  editIcon.setAttribute('alt', 'edit task icon');

  function toggle(mode) {
    popup.className = 'popup task';
    popup.classList.add(mode);

    while (btnsWrapper.firstChild) {
      btnsWrapper.firstChild.innerText = '';
      btnsWrapper.removeChild(btnsWrapper.firstChild);
    }

    listItems.forEach((child, index) => {
      if (index === listItems.length - 1) {
        return;
      }
      const field = child.children[1];
      console.log(child, field);
      field.disabled = false;
    });

    title.innerText = '';

    popup.classList.add(mode);
    if (popup.classList.contains('overview')) {
      listItems.forEach((child, index) => {
        if (index === listItems.length - 1) {
          return;
        }
        const field = child.children[1];
        console.log(child, field);
        field.disabled = true;
      });
      title.innerText = 'Task Overview';
      btnOne.setAttribute('id', 'delete-task-button');
      btnOne.style.backgroundColor = 'red';
      btnOne.appendChild(deleteIcon);
      btnTwo.setAttribute('id', 'mark-task-done-button');
      btnTwo.style.backgroundColor = 'green';
      btnTwo.appendChild(checkIcon);
      btnThree.setAttribute('id', 'edit-task-button');
      btnThree.style.backgroundColor = 'blueviolet';
      btnThree.appendChild(editIcon);
      btnsWrapper.appendChild(btnOne);
      btnsWrapper.appendChild(btnTwo);
      btnsWrapper.appendChild(btnThree);
    } else if (popup.classList.contains('edit')) {
      title.innerText = 'Edit Task';
      btnOne.setAttribute('id', 'cancel-btn');
      btnOne.style.backgroundColor = 'red';
      btnOne.style.padding = '1rem 0';
      btnOne.innerText = 'Cancel';
      btnTwo.setAttribute('id', 'commit-btn');
      btnTwo.style.backgroundColor = 'blueviolet';
      btnTwo.style.padding = '1rem 0';
      btnTwo.innerText = 'Save changes';
      btnsWrapper.appendChild(btnOne);
      btnsWrapper.appendChild(btnTwo);
    } else if (popup.classList.contains('add')) {
      title.innerText = 'Add a New Task';
      btnOne.setAttribute('id', 'cancel-btn');
      btnOne.style.backgroundColor = 'red';
      btnOne.style.padding = '1rem 0';
      btnOne.innerText = 'Cancel';
      btnTwo.setAttribute('id', 'commit-btn');
      btnTwo.style.backgroundColor = 'blueviolet';
      btnTwo.innerText = 'Add task';
      btnTwo.style.padding = '1rem 0';
      btnsWrapper.appendChild(btnOne);
      btnsWrapper.appendChild(btnTwo);
      console.log("Hello");
    }
  }

  return { popup: overlay, toggle };
}