export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const restrict = (req, res, next) => {
    if (req.cookies.userId) {
        next();
    } else {
        res.status(401).json({ message: "Invalid user credentials" });
    }
}
