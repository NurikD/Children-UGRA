const Router = require('express');
const events = require('../../database/controllers/events');
const auth = require('../../middlewares/authentication');

const router = new Router();

router.get('/cities', events.cities);
router.get('/talents', events.talents);
router.get('/create', auth, events.events);
router.get('/childrens', auth, events.childrens);
router.get('/organizers', auth, events.organizers);

// router.post('', user.create);
// router.get('', user.getAll);
// router.get('/:id', user.get);
// router.put('/users/:id', user.update);
// router.delete('/users/:id', user.delete);

module.exports = router;
