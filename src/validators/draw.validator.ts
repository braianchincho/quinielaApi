import { Request, Response, NextFunction } from "express";

export default function validateDrawQuery(req: Request, res: Response, next: NextFunction) {
    const dateParam = req.query.date as string | '';
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateParam) {
        next();
        return;
    }

    if (!dateRegex.test(dateParam)) {
        return res.status(400).json({ error: "Date must be in format yyyy-mm-dd" });
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ error: "Invalid date" });
    }

    next();
}