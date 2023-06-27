import './style.css';
import Task from './task.js';
import Project from './project.js';
import AppController from './app';

const helloWorld = document.createElement('p');
helloWorld.innerText = "Hello World!";
helloWorld.style.color = 'red';

document.body.appendChild(helloWorld);

const app = AppController();

console.log(app.projects);

app.addTask({
  name: 'Work on Todo app',
  project: 'webdev',
});

console.log(app.projects);

app.addTask({
  name: 'Commit latest change',
  project: 'webdev',
});

console.log(app.projects);

app.addTask({
  name: 'drink 2 ltr of water',
  project: 'life',
});

console.log(app.projects);

app.addTask({
  name: 'delete this',
});

console.log(app.projects);

app.removeTask('delete this');

console.log(app.projects);
