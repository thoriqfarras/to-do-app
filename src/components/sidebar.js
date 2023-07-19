import InboxSvg from './inbox-outline.svg';
import TodaySvg from './calendar-today-outline.svg';
import WeekSvg from './view-week-outline.svg';
import LogbookSvg from './book-open-outline.svg';
import EditSvg from './edit-task-icon.svg';
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
      if (project.name === 'inbox') continue;
      const circle = document.createElement('div');
      const projectAnchor = document.createElement('a');
      const projectName = document.createElement('p');
      const editBtn = document.createElement('img');
      circle.style.pointerEvents = 'none';
      circle.classList.add('circle');
      projectName.innerText = project.name;
      projectName.style.pointerEvents = 'none';
      projectAnchor.dataset.projectName = project.name;
      editBtn.setAttribute('id', 'edit-proj-btn');
      editBtn.setAttribute('src', EditSvg);
      projectAnchor.appendChild(circle);
      projectAnchor.appendChild(projectName);
      projectAnchor.appendChild(editBtn);
      projectList.appendChild(projectAnchor);
    }
  }
  
  loadProjectList(projects);
  
  return {
    sidebar,
    loadProjectList,
  };
}