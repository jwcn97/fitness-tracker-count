import { retrieve, writeToFile } from "./utils/fsHandle";

export class UserCountHandler {
    counts: Record<string, number> = {};

    constructor() {
        this.counts = retrieve();
    }

    displayUserCounts() {
        if (!this.counts || !Object.keys(this.counts).length) {
            return '';
        }
        return Object.entries(this.counts).map(([username, count]) => `${username}: 🏋️ x${count}`).join('\n');
    }

    increase(username: string) {
        if (!this.counts || !(username in this.counts)) {
            this.counts[username] = 1;
        }
        this.counts[username]++;
        this.save();
    }

    decrease(username: string) {
        if (!this.counts || !(username in this.counts)) {
            return;
        }
        this.counts[username]--;
        this.save();
    }

    save() {
        writeToFile({...this.counts})
    }
}