import '../style.css';
import TaskItem from './taskItem.js';
import Footer from './footer.js';

export default function Main(activeProject) {
  const main = document.createElement('main');
  main.classList.add('main-content');
  
  const pageTitle = document.createElement('h1');
  const tasksList = document.createElement('ul');
  tasksList.classList.add('tasks');
  
  function loadProject(activeProject) {

    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    while (tasksList.firstChild) {
      tasksList.removeChild(tasksList.firstChild);
    }

    main.appendChild(pageTitle);
    main.appendChild(tasksList);

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