const Joi = require('@hapi/joi');
const uuid = require('uuid/v4');

const usersDB = [];

const userSchema = Joi.object({
    id: Joi.forbidden(),
    login: Joi.string()
        .required()
        .trim(),
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'password pattern')
        .min(8),
    age: Joi.number()
        .required()
        .positive()
        .integer()
        .min(4)
        .max(130),
    isDeleted: Joi.forbidden()
});

export class UsersController {
    findUserById(req, res, next, id) {
        req.user = usersDB.find((userDB) => userDB.id === id);
        next();
    }

    getUsers(req, res) {
        const sortedUsers = usersDB.slice(0).sort((a, b) => (a.login.toUpperCase() > b.login.toUpperCase() ? 1 : -1));
        const limit = !req.query.limit ? undefined : Number(req.query.limit);
        const loginSubstring = req.query.loginSubstring === '' ? undefined : req.query.loginSubstring;

        if (loginSubstring === undefined && limit === undefined) {
            res.send(sortedUsers);
        } else if (limit === undefined || limit <= 0) {
            res.send(sortedUsers.filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase())));
        } else if (loginSubstring === undefined) {
            res.send(sortedUsers.slice(0, limit));
        } else {
            res.send(
                sortedUsers
                    .filter((user) => user.login.toLowerCase().includes(loginSubstring.toLowerCase()))
                    .slice(0, limit)
            );
        }
    }

    getUserById(req, res) {
        if (req.user) {
            res.json(req.user);
        } else {
            res.status(404).json({ message: `User with id='${req.params.id}' not found` });
        }
    }

    createNewUser(req, res) {
        const result = userSchema.validate(req.body, { abortEarly: false });

        if (!!result.error) {
            res.status(400).send(result.error.details);
            return;
        }

        const isExistingUser = usersDB.find((user) => user.login === result.value.login);

        if (!isExistingUser || isExistingUser.isDeleted) {
            usersDB.push({ ...result.value, ...{ id: uuid(), isDeleted: false } });
            res.status(201).send();
        } else {
            res.status(400).send('This login has already been registered');
        }
    }

    updateUser(req, res) {
        const result = userSchema.validate(req.body, { abortEarly: false });

        if (!req.user) {
            res.status(404).send('There is no such user in db');
        } else if (!!result.error) {
            res.status(400).send(result.error.details);
        } else if (req.user.isDeleted) {
            res.status(405).send('User was deleted. Action cannot be applied');
        } else {
            const index = usersDB.findIndex((user) => user.id === req.params.id);
            usersDB[index] = { ...usersDB[index], ...result.value };
            res.send();
        }
    }

    deleteUser(req, res) {
        const index = usersDB.findIndex((user) => user.id === req.params.id);

        if (!req.user) {
            res.status(404).send('There is no such user in db');
        } else if (req.user.isDeleted) {
            res.status(405).send('User has already been deleted. Action cannot be applied');
        } else {
            usersDB[index].isDeleted = true;
            res.send();
        }
    }
}
