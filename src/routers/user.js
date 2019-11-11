const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        await user.save();

        res.status(201).send({user,token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user: user,
            token: token,
        });
    } catch (e) {
        res.status(400).send();
    }
});

router.get('', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isOperationValid = updates.every(update => allowedUpdates.includes(update));

    if (!isOperationValid) {
        res.status(400).send({
            error: 'Invalid updates.'
        });
    }

    try {
        const user = await User.findById(req.params.id);

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }

});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});


module.exports = router;
