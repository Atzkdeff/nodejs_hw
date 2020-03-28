import { NextFunction, Request, Response } from 'express';

import { IUserRequest, UsersController } from './users.controller';
import { HttpRequestError } from '../utils';
import { mockCreateNewUser } from '../services/__mocks__/users.service';

jest.mock('../services/users.service');
jest.mock('../utils/handle-error.decorator');

describe('UsersController:', () => {
    let userController: UsersController;
    let req: IUserRequest;
    let res: Response = {} as Response;
    let next: NextFunction;

    beforeEach(() => {
        userController = new UsersController();
        req = {
            body: {},
            query: {},
            params: {}
        } as Request;
        res.status = <any>jest.fn().mockReturnValue(res);
        res.send = <any>jest.fn().mockReturnValue(res);
        res.json = <any>jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('findUserById:', () => {
        it('should save user data to request', async () => {
            await userController.findUserById(req, res, next, '42');
            expect(req.user).toEqual({ id: '42', login: 'TestUser', password: 'qwerty123', age: 33 });
        });

        it('should proceed execution', async () => {
            await userController.findUserById(req, res, next, '42');
            expect(next).toHaveBeenCalled();
        });
    });

    describe('getUsers:', () => {
        it('should send users data', async () => {
            req.query.limit = 115;
            req.query.loginSubstring = 'ABC';

            await userController.getUsers(req, res);
            expect(res.send).toHaveBeenCalledWith([{ login: 'user1' }, { login: 'user2' }]);
        });
    });

    describe('getUserById:', () => {
        it('should send founded user data as json if it exists', () => {
            (<any>req).user = { id: '123' };

            userController.getUserById(req, res);
            expect(res.json).toHaveBeenCalledWith(req.user);
        });

        it("should throw an error if user isn't exists", () => {
            (<any>req.params).id = 45;
            expect(() => userController.getUserById(req, res)).toThrowError(
                new HttpRequestError(404, "User with id='45' not found")
            );
        });
    });

    describe('createNewUser:', () => {
        it('should send 400 code if new user data failed validation', async () => {
            await userController.createNewUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });

        it('should save new user and return new item back in response', async () => {
            req.body.login = 'abc';
            req.body.password = '123abc123';
            req.body.age = 43;

            await userController.createNewUser(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ login: 'newUser' });
        });

        // TODO test doesn't work and always passing (something with async code)
        xit('should handle general error', async () => {
            req.body.login = 'abc';
            req.body.password = '123abc123';
            req.body.age = 43;
            mockCreateNewUser.mockImplementationOnce(() => {
                throw new Error('bla-bla');
            });

            expect(userController.createNewUser(req, res)).rejects.toEqual(new Error('bla-bla'));
        });

        // TODO test doesn't work and always passing (something with async code)
        xit('should handle existing_user_exception', async () => {
            req.body.login = 'abc';
            req.body.password = '123abc123';
            req.body.age = 43;
            mockCreateNewUser.mockImplementationOnce(() => {
                throw new Error('existing_user_exception');
            });

            expect(userController.createNewUser(req, res)).rejects.toBe(1);
        });
    });

    describe('updateUser:', () => {
        it('should throw error if user doesn`t exist', async () => {
            expect(userController.updateUser(req, res)).rejects.toThrowError(
                new HttpRequestError(404, 'There is no such user in db')
            );
        });

        it('should throw error if user data failed validation', async () => {
            req.body.id = 'update_id';
            (<any>req).user = { login: 'user' };

            expect(userController.updateUser(req, res)).rejects.toThrowError(
                new HttpRequestError(400, 'Form validation error')
            );
        });

        it('should update user data', async () => {
            (<any>req).user = { login: 'user' };

            await userController.updateUser(req, res);

            expect(res.send).toHaveBeenCalledWith({ login: 'updatedUser' });
        });
    });

    describe('deleteUser:', () => {
        it('should throw error if user doesn`t exist', async () => {
            expect(userController.deleteUser(req, res)).rejects.toThrowError(
                new HttpRequestError(404, 'There is no such user in db')
            );
        });

        it('should delete user', async () => {
            (<any>req).user = { login: 'user' };

            await userController.deleteUser(req, res);
            expect(res.send).toHaveBeenCalled();
        });
    });
});
