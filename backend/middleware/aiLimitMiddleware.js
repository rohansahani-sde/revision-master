import User from "../models/User.js";

export const checkAiLimit = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        const today = new Date();
        const lastDate = new Date(user.lastUsedDate);

        // ✅ Check same day
        const isSameDay =
            today.getFullYear() === lastDate.getFullYear() &&
            today.getMonth() === lastDate.getMonth() &&
            today.getDate() === lastDate.getDate();

        // 🔄 Reset if new day
        if (!isSameDay) {
            user.aiUsageCount = 0;
            user.lastUsedDate = today;
        }

        // ❌ Limit reached
        if (user.aiUsageCount >= 2) {
            return res.status(403).json({
                message: "Daily AI limit reached (2/day). Upgrade for more 🚀"
            });
        }

        // ✅ Increase count
        user.aiUsageCount += 1;
        await user.save();

        next();
    } catch (err) {
        res.status(500).json({ error: "Limit check failed" });
    }
};