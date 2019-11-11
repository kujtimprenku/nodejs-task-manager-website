const express = require('express');
const router = new express.Router();
const Task = require('../models/task');

router.post('', async (req, res) => {
    const task = Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send();
    }
});

router.get('', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isOperationValid = updates.every(update => allowedUpdates.includes(update));

    if (!isOperationValid) {
        return res.status(400).send({
            error: 'Invalid updates.'
        });
    }

    try {
        const task = await Task.findById(req.params.id);

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        if (!task) {
            req.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
