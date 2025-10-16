import mongoose from 'mongoose';
import Checkin from "./models/checkIn";
import { getQuarterRange } from './utils';

export class UserCountHandler {
    counts: Record<string, number> = {};

    constructor() {
        mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch((err) => console.error("❌ MongoDB connection error:", err));
    }

    async displayUserCounts(input?: string) {
        const { start, end, quarterLabel } = getQuarterRange(input);

        const results = await Checkin.aggregate([
            {
                $match: {
                    timestamp: { $gte: start, $lte: end },
                },
            },
            {
                $group: {
                _id: "$username",
                count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 }, // optional: sort by count descending
            },
        ]);

        if (results.length === 0) {
            return '';
        } else {
            return quarterLabel + '\n\n' + results
            .map((r) => `${r._id}: 🏋️ x${r.count}`)
            .join("\n");
        }
    }

    async increase(username: string) {
        const newCheckin = new Checkin({ username });
        await newCheckin.save();
    }

    async clear() {
        await Checkin.deleteMany({});
    }
}