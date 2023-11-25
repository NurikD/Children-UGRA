const Router = require('express');
const user = require('../../database/controllers/user');
const auth = require('../../middlewares/authentication');

const router = new Router();

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/getMe', auth, (req, res) => { res.status(200).json(req.user); });

router.get('/get/:role/:id', auth, user.getById);
router.post('/update/:role/:id', auth, user.updateById);
router.post('/delete/:role/:id', auth, user.deleteById);

// router.delete('/users/:id', user.delete);

module.exports = router;
