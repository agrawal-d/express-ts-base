import express from "express";
import { body, query } from "express-validator";
import validate from "../middleware/validate";
import { isValidId } from "../vaultLogic";
import path from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
const router = express.Router();

const TEN_MB_IN_BYTES = 10 * 1024 * 1024;

/* GET home page. */
router.get("/", validate, function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.get("/get/:id/:fileName", function (req, res, next) {
    const id = req.params?.id as string;
    const fileName = req.params?.fileName as string;
    if (!isValidId(id)) {
        return res.status(401).json({
            error: "Invalid ID",
        });
    }

    const filePath = path.join(
        path.resolve(__dirname),
        "../..",
        "private",
        "files",
        id,
        fileName,
    );

    if (!existsSync(filePath)) {
        return res.status(401).json({
            error: "Invalid file name",
        });
    }

    return res.sendFile(filePath);
});

router.post(
    "/set/:id/:fileName",
    body("data").isString().isLength({
        min: 0,
        max: TEN_MB_IN_BYTES,
    }),
    validate,
    function (req, res, next) {
        const id = req.params?.id as string;
        const data = req.body.data as string;
        const fileName = req.params?.fileName as string;

        if (!isValidId(id)) {
            return res.status(401).json({
                error: "Invalid ID",
            });
        }

        const dirPath = path.join(
            path.resolve(__dirname),
            "../..",
            "private",
            "files",
            id,
        );

        const filePath = path.join(dirPath, fileName);

        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
        }
        writeFileSync(filePath, data);

        return res.json({
            status: "OK",
        });
    },
);

export default router;
