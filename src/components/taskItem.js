import '../style.css';
import TaskNoteSvg from './text.svg';
import Flag from './flag-variant.svg';

export default function TaskItem(task) {
  const taskItem = document.createElement('li');
  const taskWrapperMain = document.createElement('div');
  const taskWrapperInfo = document.createElement('div');
  taskItem.classList.add('task-item');
  taskWrapperMain.classList.add('task-wrapper', 'main');
  taskWrapperMain.style.pointerEvents = 'none'; 
  taskWrapperInfo.classList.add('task-wrapper', 'info');
  taskWrapperInfo.style.pointerEvents = 'none'; 
  
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  taskItem.appendChild(checkBox);
  
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
  
  taskItem.appendChild(taskWrapperMain);
  taskItem.appendChild(taskWrapperInfo);
  
  return taskItem;
}