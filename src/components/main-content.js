import '../style.css';
import TaskItem from './taskItem.js';
import Footer from './footer.js';
import { capitalize } from 'lodash';

export default function Main(activeProject) {
  const main = document.createElement('main');
  main.classList.add('main-content');
  
  const pageTitle = document.createElement('h1');
  const tasksList = document.createElement('ul');
  tasksList.classList.add('tasks');
  
  main.appendChild(pageTitle);
  main.appendChild(tasksList);
  
  function loadProject(activeProject) {
    if (activeProject.name === 'inbox') {
      pageTitle.innerText = capitalize(activeProject.name);
    } else {
      pageTitle.innerText = activeProject.name;
    }
    
    const tasks = activeProject.getTasks();
    tasks.forEach(task => {
      tasksList.appendChild(new TaskItem(task));
    });
  }
  
  loadProject(activeProject);
  main.appendChild(Footer());
  
  return { main, loadProject };
}