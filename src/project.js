export default class Project {
  constructor(name) {
    this.name = name;
    this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    this._tasks = [];
  }

  edit(newName) {
    this.name = newName;
    this._tasks.forEach(task => {
      task.edit({ project: newName });
    });
  }

  addTask(task) {
    this._tasks.push(task);
    console.log(`${task.name} added to ${this.name}`);
  }

  removeTask(task) {
    this._tasks = this._tasks.filter(t => t !== task);
    console.log(`${task.name} deleted from ${this.name}`);
  }

  getTasks() { return this._tasks };
}