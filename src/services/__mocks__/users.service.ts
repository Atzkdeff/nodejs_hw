export const mockGetUserById = jest
    .fn()
    .mockReturnValue({ id: '42', login: 'TestUser', password: 'qwerty123', age: 33 });

export const mockGetUsers = jest.fn().mockReturnValue([{ login: 'user1' }, { login: 'user2' }]);

export const mockCreateNewUser = jest.fn().mockReturnValue({ login: 'newUser' });

export const mockUpdateUser = jest.fn().mockReturnValue({ login: 'updatedUser' });

export const mockDeleteUser = jest.fn().mockReturnValue({});

export const UsersService = jest.fn().mockImplementation(
    jest.fn().mockReturnValue({
        getUserById: mockGetUserById,
        getUsers: mockGetUsers,
        createNewUser: mockCreateNewUser,
        updateUser: mockUpdateUser,
        deleteUser: mockDeleteUser
    })
);
