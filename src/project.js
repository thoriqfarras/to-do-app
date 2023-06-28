export default class Project {
  constructor(name) {
    this.name = name;
    this._tasks = [];
  }

  getName() { return this.name };

  setName(name) { this.name = name };

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