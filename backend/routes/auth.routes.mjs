import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import secretConfig from "../secret-config";

router.route("/").post((req, res) => {
    var token = jwt.sign({
            id: req.body.id
        },
        secretConfig.secret, {
            expiresIn: 86400 // expires in 24 hours
        }
    );
    res.status(200).send({
        token: token
    });
});


export default router;