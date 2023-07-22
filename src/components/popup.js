import '../style.css';
import CheckSvg from './check.svg';
import DeleteSvg from './delete-task-icon.svg';
import EditSvg from './edit-task-icon.svg';

export default function Popup() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  
  const popup = document.createElement('ul');
  popup.classList.add('popup');
  overlay.appendChild(popup);
  
  const title = document.createElement('h2');
  popup.appendChild(title);
  
  function loadWarningMessage(code, name, referenceNode) {
    const msg = document.createElement('p');
    msg.setAttribute('id', 'warning-msg');
    switch (code) {
      case -1:
      msg.innerText = 'Project name cannot be blank';
      break;
      case 0:
      msg.innerText = `'${name}' already exists`;
      break;
      default:
      break;
    }
    msg.style.color = 'red';
    msg.style.fontSize = '1rem';
    referenceNode.parentElement.insertBefore(msg, referenceNode.nextSibling);
  }
  
  function clearWarningMessage() {
    popup.querySelector('#warning-msg')?.remove();
  }
  
  return { 
    popup: overlay, 
    loadWarningMessage,
    clearWarningMessage,
  };
}

export function PopupTask(projects) {
  let state = '';
  
  const overlay = Popup().popup;
  const popup = overlay.querySelector('.popup');
  const title = popup.querySelector('h2');
  popup.classList.add('task');
  popup.setAttribute('id', 'popup-task');
  
  for (let i = 0; i < 6; i++) {
    const wrapper = document.createElement('li');
    popup.appendChild(wrapper);
  }
  
  const listItems = popup.querySelectorAll('li');
  
  const statusWrapper = document.createElement('li');
  const statusLabel = document.createElement('p');
  const status = document.createElement('span');
  statusLabel.innerText = 'Status: ';
  statusLabel.style.color = 'gray';
  statusLabel.appendChild(status);
  statusWrapper.appendChild(statusLabel);
  
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
  
  for (const project of projects) {
    if (
      project.name === 'Today' ||
      project.name === 'Next 7 days' ||
      project.name === 'Logbook'
    ) continue;
    const projectOption = document.createElement('option');
    projectOption.setAttribute('value', project.name);
    projectOption.innerText = project.name;
    taskProject.appendChild(projectOption);
  }
  const addNewProjectOption = document.createElement('option');
  addNewProjectOption.setAttribute('value', 'add-new');
  addNewProjectOption.innerText = '+ Add new project...';
  taskProject.appendChild(addNewProjectOption);
  
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
  
  const btnsWrapper = listItems[listItems.length - 1];
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
    
    enableFormFields();
    
    title.innerText = '';
    statusWrapper.remove();
    
    popup.classList.add(mode);
    if (popup.classList.contains('overview')) {
      disableFormFields();
      title.innerText = 'Task Overview';
      status.innerText = 'to do';
      status.style.color = 'red';
      popup.insertBefore(statusWrapper, taskTitleLabel.parentElement);
      btnOne.setAttribute('id', 'delete-task-btn');
      btnOne.style.backgroundColor = 'red';
      btnOne.style.padding = '1rem 0';
      // btnOne.appendChild(deleteIcon);
      btnOne.innerText = 'Delete';
      btnTwo.setAttribute('id', 'mark-task-done-btn');
      btnTwo.style.backgroundColor = 'green';
      btnTwo.style.padding = '1rem 0';
      // btnTwo.appendChild(checkIcon);
      btnTwo.innerText = 'Mark as done';
      btnThree.setAttribute('id', 'edit-task-btn');
      btnThree.style.backgroundColor = 'blueviolet';
      btnThree.style.padding = '1rem 0';
      // btnThree.appendChild(editIcon);
      btnThree.innerText = 'Edit';
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
    }
    state = mode;
  }

  function enableFormFields() {
    listItems.forEach((child, index) => {
      if (index === listItems.length - 1) {
        return;
      }
      const field = child.children[1];
      field.disabled = false;
    });
  }

  function disableFormFields() {
    listItems.forEach((child, index) => {
      if (index === listItems.length - 1) {
        return;
      }
      const field = child.children[1];
      field.disabled = true;
    });
  }

  return { 
    ...Popup(), 
    popup: overlay, 
    getState: () => { return state }, 
    toggle,
    enableFormFields,
    disableFormFields, 
  };
}

export function PopupProject() {
  let state = '';
  
  const overlay = Popup().popup;
  const popup = overlay.querySelector('.popup');
  const title = popup.querySelector('h2');
  popup.setAttribute('id', 'popup-project');
  popup.appendChild(title);
  
  for (let i = 0; i < 3; i++) {
    const wrapper = document.createElement('li');
    popup.appendChild(wrapper);
  }
  
  const listItems = popup.querySelectorAll('li');
  
  const projectTitleLabel = document.createElement('label');
  const projectTitle = document.createElement('input');
  projectTitleLabel.innerText = 'Title';
  projectTitleLabel.setAttribute('for', 'project-title');
  projectTitle.setAttribute('id', 'project-title');
  projectTitle.setAttribute('type', 'text');
  listItems[0].appendChild(projectTitleLabel);
  listItems[0].appendChild(projectTitle);
  
  const btnsWrapper = listItems[listItems.length - 1];
  popup.appendChild(btnsWrapper);
  const btnOne = document.createElement('button');
  const btnTwo = document.createElement('button');
  btnOne.setAttribute('id', 'cancel-btn');
  btnOne.style.backgroundColor = 'red';
  btnOne.style.padding = '1rem 0';
  btnOne.innerText = 'Cancel';
  btnTwo.setAttribute('id', 'commit-btn');
  btnTwo.style.backgroundColor = 'blueviolet';
  btnTwo.style.padding = '1rem 0';
  btnsWrapper.appendChild(btnOne);
  btnsWrapper.appendChild(btnTwo);
  
  function toggle(mode) {
    if (mode === 'add') {
      title.innerText = 'Add a New Project';
      btnTwo.innerText = 'Add project';      
    } else if (mode === 'edit') {
      title.innerText = 'Edit Project';
      btnTwo.innerText = 'Save';      
    }
    state = mode;
    console.log(state, mode);
  }
  
  function fillTitleField(titleText) {
    projectTitle.value = titleText;
  }
  
  return { 
    ...Popup(), 
    popup: overlay, 
    getState: () => { return state }, 
    toggle,
    fillTitleField,
  };
}