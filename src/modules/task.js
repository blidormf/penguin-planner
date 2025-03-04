export class Task {
    constructor(title, dueDate, priority, desc) {
        if (!Object.values(PRIORITY).includes(priority)) {
            throw new Error('Invalid priority level');
        }

        this.title = title
        this.dueDate = dueDate;
        this.priority = priority;
        this.desc = desc;
        this.complete = false;
        this.projectId = null;
    }

    toggleComplete() {
        this.complete = !this.complete;
    }

    setProject(project) {
        this.projectId = project ? project.title : null;
    }
}

export const PRIORITY = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
};