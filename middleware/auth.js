export const verifyAuth = (req, res, next) =>{
    const token = process.env.TOKEN;

    if (req.query.apiToken !== token) {
        throw new Error("Invalid Auth");
    }

    next();
}