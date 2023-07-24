import Project from './project.js';
import Task from './task.js';
import { format, addDays, formatDistanceStrict, parseISO } from 'date-fns';

let taskIdCounter = 0;

export default function AppController() {

  const inbox = new Project('Inbox', 'blueviolet');
  const today = new Project('Today');
  const nextWeek = new Project('Next 7 days');
  const logbook = new Project('Logbook');

  let projects = [inbox, today, nextWeek, logbook];

  // task controls
  function addTask(taskInfo) {
    if (!taskInfo.title) return -1;
    const task = new Task({ id: taskIdCounter, ...taskInfo });
    let targetProject = projects.find(p => p.title === task.project);
    if (!targetProject) {
      console.log(`project '${task.project}' doesn't exist. creating...`);
      addProject(task.project);
      targetProject = projects.at(-1);
    }
    task.projectColor = targetProject.color;
    targetProject.addTask(task);
    logbook.addTask(task);
    taskIdCounter++;
    return 1;
  }

  function editTask(task, { ...args }) {
    if (!args.title) return -1;
    const oldProjectTitle = task.project;
    task.edit({ ...args });
    if (oldProjectTitle !== task.project) {
      const oldProject = getProjectByTitle(oldProjectTitle);
      const newProject = getProjectByTitle(task.project);
      newProject.addTask(task);
      oldProject.removeTask(task);
    }
    return 1;
  }

  function removeTask(task) {
    for (const project of projects) {
      if (project.getTasks().includes(task)) {
        project.removeTask(task);
        logbook.removeTask(task);
        return;
      }
    }
    console.log(`${task.title} is not found`);
  }

  function getAllTasks() {
    return logbook.getTasks();
  }

  // project controls
  function addProject(title, color="") {
    if (getProjectTitles().includes(title)) {
      console.log(`project '${title}' already exists.`);
      return 0;
    } else if (!title) {
      console.log('project title cannot be blank');
      return -1;
    }
    const newProject = new Project(title, color);
    projects.push(newProject);
    console.log(`project '${title}' added`);
    return 1;
  }

  function editProject(project, newProjectTitle, newProjectColor='') {
    if (getProjectTitles().filter(title => title != project.getTitle()).includes(newProjectTitle)) {
      console.log(`${newProjectTitle} already exist`);
      return 0;
    } else if (!newProjectTitle) {
      console.log('project title cannot be blank');
      return -1;
    }
    const oldTitle = project.title;
    project.edit({ title: newProjectTitle, color: newProjectColor });
    console.log(`'${oldTitle}' changed to '${newProjectTitle}': `, projects);
    return 1;
  }

  function updateToday() {
    for (const task of today.getTasks()) {
      today.removeTask(task);
    } 
    const todayTasks = getAllTasks().filter(task => task.due === format(new Date(), 'yyyy-MM-dd'));
    todayTasks.forEach(task => {
      today.addTask(task);
      console.log(task.title + ' was added to today');
    });
  }

  function updateNextWeek() {
    for (const task of nextWeek.getTasks()) {
      nextWeek.removeTask(task);
    } 
    getAllTasks().forEach(task => {
      if (task.due) {
        const nextWeekEnd = addDays(new Date(), 7);
        const distance = formatDistanceStrict(nextWeekEnd, new Date(task.due), {unit: 'day', addSuffix: true});
        console.log(distance);
        if (distance.includes('in')) {
          nextWeek.addTask(task);
        }
      }
    });
  }

  function getTaskById(id) {
    const allTasks = getAllTasks();
    return allTasks.find(task => +task.getId() === +id);
  }

  function getProjects() {
    return projects;
  }

  function getProjectTitles() {
    return projects.map(project => project.title);
  }

  function getProjectByTitle(title) {
    return projects.find(project => project.title === title);
  }

  return {
    addTask,
    editTask,
    removeTask,
    addProject,
    editProject,
    getProjects,
    getProjectTitles,
    getProjectByTitle,
    getAllTasks,
    getTaskById,
    updateToday,
    updateNextWeek,
  };
}