import mongoose from 'mongoose';
import Checkin from "./models/checkIn";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export class UserCountHandler {
    counts: Record<string, number> = {};

    constructor() {}

    async displayUserCounts() {
        const checkins = await Checkin.find().sort({ timestamp: -1 }).limit(5);
        if (checkins.length === 0) {
          return '';
        }
      
        const list = checkins
          .map((c: any) => `${c.username} - ${(c.timestamp as Date).toLocaleString("en-SG")}`)
          .join("\n");
        return list;
    }

    async increase(username: string) {
        const newCheckin = new Checkin({ username });
        await newCheckin.save();
    }
}