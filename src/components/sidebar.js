import InboxSvg from './inbox-outline.svg';
import TodaySvg from './calendar-today-outline.svg';
import WeekSvg from './view-week-outline.svg';
import LogbookSvg from './book-open-outline.svg';
import EditSvg from './edit-task-icon.svg';
import DeleteSvg from './delete-task-icon.svg';
import '../style.css';

export default function Sidebar(projects) {
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
    optionAnchor.classList.add('project-item');
    optionIcon.style.pointerEvents = 'none';
    optionText.style.pointerEvents = 'none';
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
    while (projectList.firstChild) {
      projectList.removeChild(projectList.firstChild);
    }
    for (const project of projects) {
      if (
        project.title === 'Inbox' ||
        project.title === 'Today' ||
        project.title === 'Next 7 days' ||
        project.title === 'Logbook'
      ) continue;
      const projectWrapper = document.createElement('li');
      const projectAnchor = document.createElement('a');
      const circle = document.createElement('div');
      const colorPicker = document.createElement('input');
      const projectTitle = document.createElement('p');
      const editBtn = document.createElement('img');
      const deleteBtn = document.createElement('img');
      projectAnchor.dataset.projectTitle = project.title;
      projectAnchor.classList.add('project-item');
      circle.style.backgroundColor = project.color;
      circle.classList.add('circle');
      colorPicker.setAttribute('type', 'color');
      colorPicker.classList.add('project-color');
      colorPicker.value = project.color;
      projectTitle.innerText = project.title;
      projectTitle.style.pointerEvents = 'none';
      editBtn.setAttribute('id', 'edit-proj-btn');
      editBtn.setAttribute('src', EditSvg);
      deleteBtn.setAttribute('id', 'delete-proj-btn');
      deleteBtn.setAttribute('src', DeleteSvg);
      projectAnchor.appendChild(circle);
      projectAnchor.appendChild(colorPicker);
      projectAnchor.appendChild(projectTitle);
      projectAnchor.appendChild(editBtn);
      projectAnchor.appendChild(deleteBtn);
      projectWrapper.appendChild(projectAnchor);
      projectList.appendChild(projectWrapper);
    }
  }
  
  loadProjectList(projects);
  
  return {
    sidebar,
    loadProjectList,
  };
}