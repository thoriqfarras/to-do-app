import App from './app';
import InboxSvg from './inbox-outline.svg';
import TodaySvg from './calendar-today-outline.svg';
import WeekSvg from './view-week-outline.svg';
import LogbookSvg from './book-open-outline.svg';
import './style.css';
const capitalize = require('lodash/capitalize');

// Components

export function Sidebar() {
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

  const projects = App().getProjects();
  const projectList = document.createElement('ul');
  projectList.classList.add('sidebar-main');
  sidebar.appendChild(projectList);
  console.log(projects);

  function loadProjectList() {
    for (const project of projects) {
      const circle = document.createElement('div');
      const projectAnchor = document.createElement('a');
      const projectName = document.createElement('p');
      circle.classList.add('circle');
      projectName.innerText = capitalize(project.name);
      projectAnchor.appendChild(circle);
      projectAnchor.appendChild(projectName);
      projectList.appendChild(projectAnchor);
    }
  }

  loadProjectList();
  
  return {
    sidebar,
    loadProjectList,
  };
}