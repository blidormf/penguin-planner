export default class Project {
    constructor(title, desc) {
        this.title = title;
        this.desc = desc;
        this.tasks = [];
    }

    addTask(task) {
        task.setProject(this);
        this.tasks.push(task);
    }

    removeTask(task) {
        this.tasks = this.tasks.filter(obj => obj.id !== task.id);
    }
}