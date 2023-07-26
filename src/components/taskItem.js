import '../style.css';
import { format } from 'date-fns';
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
  taskTitle.innerText = task.title;
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
  projectTag.style.backgroundColor = task.projectColor;
  taskWrapperInfo.appendChild(projectTag);

  if (task.priority) {
    for (let i = 0; i < task.priority; i += 1) {
      const priorityTag = document.createElement('img');
      priorityTag.setAttribute('src', Flag);
      priorityTag.setAttribute('alt', 'priority icon');
      taskWrapperInfo.appendChild(priorityTag);
    }
  }

  if (task.due) {
    const dateTag = document.createElement('span');
    dateTag.classList.add('task-tag', 'date');
    dateTag.innerText = format(new Date(task.due), 'dd/MM/yyyy');
    taskWrapperInfo.appendChild(dateTag);
  }

  taskItem.appendChild(taskWrapperMain);
  taskItem.appendChild(taskWrapperInfo);

  taskItem.dataset.id = task.getId();

  return taskItem;
}
