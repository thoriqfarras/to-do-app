import Project from './project.js';
import Task from './task.js';

let taskIdCounter = 0;

export default function AppController() {

  const inbox = new Project('Inbox');
  const today = new Project('Today');
  const nextWeek = new Project('Next 7 days');
  const logbook = new Project('Logbook');

  let projects = [inbox, today, nextWeek, logbook];

  // task controls
  function addTask(taskInfo) {
    const task = new Task({ id: taskIdCounter, ...taskInfo });
    let targetProject = projects.find(p => p.name === task.project);
    if (!targetProject) {
      console.log(`project '${task.project}' doesn't exist. creating...`);
      addProject(task.project);
      targetProject = projects.at(-1);
    }
    targetProject.addTask(task);
    taskIdCounter++;
  }

  function editTask(task, { ...args }) {
    const oldProjectName = task.project;
    task.edit({ ...args });
    if (oldProjectName !== task.project) {
      const oldProject = getProjectByName(oldProjectName);
      const newProject = getProjectByName(task.project);
      newProject.addTask(task);
      oldProject.removeTask(task);
    }
  }

  function removeTask(task) {
    for (const project of projects) {
      if (project.getTasks().includes(task)) {
        project.removeTask(task);
        return;
      }
    }
    console.log(`${task.name} is not found`);
  }

  function getAllTasks() {
    let allTasks = [];
    projects.forEach(project => {
      const tasks = project.getTasks();
      allTasks.push(...tasks);
    });
    return allTasks;
  }

  // project controls
  function addProject(name, color="") {
    if (getProjectNames().includes(name)) {
      console.log(`project '${name}' already exists.`);
      return 0;
    } else if (!name) {
      console.log('project name cannot be blank');
      return -1;
    }
    const newProject = new Project(name);
    if (color) newProject.color = color;
    projects.push(newProject);
    console.log(`project '${name}' added`);
    return 1;
  }

  function editProject(project, newProjectName) {
    if (getProjectNames().filter(name => name != project.name).includes(newProjectName)) {
      console.log(`${newProjectName} already exist`);
      return 0;
    } else if (!newProjectName) {
      console.log('project name cannot be blank');
      return -1;
    }
    const oldName = project.name;
    project.edit(newProjectName);
    project.getTasks().forEach(task => {
      task.edit({ project: newProjectName });
    });
    console.log(`'${oldName}' changed to '${newProjectName}': `, projects);
    return 1;
  }

  function getTaskById(id) {
    const allTasks = getAllTasks();
    return allTasks.find(task => +task.getId() === +id);
  }

  function getProjects() {
    return projects;
  }

  function getProjectNames() {
    return projects.map(project => project.name);
  }

  function getProjectByName(name) {
    return projects.find(project => project.name === name);
  }

  return {
    addTask,
    editTask,
    removeTask,
    addProject,
    editProject,
    getProjects,
    getProjectNames,
    getProjectByName,
    getAllTasks,
    getTaskById,
  };
}