export default class Task {
    constructor(key, summary) {
        this.key = key;
        this.summary = summary;
        this.events = [];
        this.filters = [];
    }
}