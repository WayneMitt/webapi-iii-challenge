const express = require('express');
const Users = require('./userDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const newPost = req.body;
    Users.insert(newPost)
    .then(data => {
        res.status(201).json(data);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'There was an error while saving the user to the database'
        })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const newComment = req.body;
    const { id } = req.params;
    Users.getById(id)
    .then(found => {
        db.insert(newComment);
        res.status(201).json(found);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'There was an error while saving the comment to the database'
        })
    })
});

router.get('/', (req, res) => {
    Users.get()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'The users information could not be retrieved.'
        })
    })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id } = req.params;
    Users.getById(id)
    .then(found => {
        res.json(found);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'The comments information could not be retrieved.'
        })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    Users.remove(id)
    .then(deletedUser => {
        res.status(200).json(deletedUser);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'The user could not be removed'
        })
    })
});

router.put('/:id', validateUserId, (req, res) => {
    const { id } = req.params;
    const changes = req.body
    Users.update(id, changes)
    .then(updated => {
        res.json(updated);
    })
    .catch(err => {
        res.status(500).json({
            err: err,
            message: 'The user information could not be modified.'
        })
    })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;

    Users.getById(id)
    .then(user => {
        if (user) {
            req.user = user;
            next();
        } else {
            next({ message: 'invalid user id' })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'Error processing request'
        });
      });
};

function validateUser(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
      } else {
        res.status(400).json({ message: "missing required name field"});
        next();
      }
};

function validatePost(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
      } else {
        res.status(400).json({ message: "missing required text field"});
        next();
      }
};

module.exports = router;
