const User = require('../models/User');
const { hash, compare } = require('bcrypt');

async function register(name,username, password) {
    const existing = await getUserByUsername(username)
    if (existing) {
        throw new Error('Username is taken');
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({
        name,
        username,
        hashedPassword
    });

    await user.save();

    return user;
}

async function login(username, password) {
    const user = await getUserByUsername(username);

    if (!user) {
        throw new Error('Incorrect Username or Password');
    }

    const validPassword = await compare(password, user.hashedPassword);

    if (!validPassword) {
        throw new Error('Incorrect Username or Password');
    }

    return user;
}

async function getUserByUsername(username) {
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    return user;
}

module.exports = {
    register,
    login
}