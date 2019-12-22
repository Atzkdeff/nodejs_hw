const express = require('express');
const Joi = require('@hapi/joi');
const uuid = require('uuid/v4');
const router = express.Router();
const usersDB = [];

const userSchema = Joi.object({
    id: Joi.string(),
    login: Joi.string()
        .required()
        .trim(),
    password: Joi.string()
        .required()
        .alphanum()
        .min(8),
    age: Joi.number()
        .required()
        .positive()
        .integer()
        .min(4)
        .max(130),
    isDeleted: Joi.boolean().required()
});

router.param('id', (req, res, next, id) => {
    req.user = usersDB.find((userDB) => userDB.id === id);
    next();
});

/**
 * GET get all users
 */
router.get('/getAllUsers', (req, res) => {
    res.send(usersDB);
});

/**
 * GET get user by id
 */
router.get('/getUser/:id', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(400).json({ message: `User with id='${req.params.id}' not found` });
    }
});

/**
 * GET get auto suggested users
 */
router.get('/getAutoSuggestUsers', (req, res) => {
    const sortedUsers = usersDB.slice(0).sort((a, b) => (a.login.toUpperCase() > b.login.toUpperCase() ? 1 : -1));
    const limitStr = req.query.limit === '' ? undefined : req.query.limit;
    const loginSubstring = req.query.loginSubstring === '' ? undefined : req.query.loginSubstring;
    const limit = Number(limitStr);

    if (loginSubstring === undefined && limitStr === undefined) {
        res.send(sortedUsers);
    } else if (loginSubstring === undefined) {
        res.send(sortedUsers.slice(0, limit));
    } else if (limitStr === undefined) {
        res.send(sortedUsers.filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase())));
    } else {
        res.send(
            sortedUsers
                .filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase()))
                .slice(0, limit)
        );
    }
});

/**
 * POST create new user
 */
router.post('/createNewUser', (req, res) => {
    const result = userSchema.validate(req.body, { abortEarly: false });

    if (!!result.error) {
        res.status(400).send(result.error.details);
        return;
    }

    const isUserExist = usersDB.find((user) => user.login === result.value.login);

    if (!result.error && !isUserExist) {
        usersDB.push({ ...result.value, ...{ id: uuid() } });
        res.status(204).send();
    } else if (isUserExist) {
        res.status(400).send('This login has already been registered');
    } else {
        res.status(400).send(result.error.details);
    }
});

/**
 * PATCH update user
 */
router.patch('/updateUser', (req, res) => {
    const result = userSchema.validate(req.body, { abortEarly: false });

    if (!!result.error) {
        res.status(400).send(result.error.details);
    }
    const index = usersDB.findIndex((user) => user.id === result.value.id);
    if (index !== -1) {
        usersDB[index] = { ...usersDB[index], ...result.value };
        res.send();
    } else {
        res.status(400).send('THere is no such user in db');
    }
});

/**
 * DELETE remove user
 */
router.delete('/removeUser', (req, res) => {
    const index = usersDB.findIndex((user) => user.id === req.body.id);

    if (index !== -1) {
        usersDB[index].isDeleted = true;
        res.send();
    } else {
        res.status(400).send();
    }
});

module.exports = router;
