export const validateNote = async (req, res, next) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    if (title.length < 3 || title.length > 15) {
        return res.status(400).json({ message: "Title must be between 3 and 15 characters" });
    }

    if (description.length > 100) {
        return res.status(400).json({ message: "Description must be less than 100 characters" });
    }

    next();
}
