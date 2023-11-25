const Router = require('express');
const search = require('../../database/controllers/search');
const auth = require('../../middlewares/authentication');

const router = new Router();

router.get('/cities', search.cities);
router.get('/talents', search.talents);
router.post('/talents/create', auth, search.createTalent);
router.get('/events', auth, search.events);
router.get('/childrens', search.childrens);
router.get('/organizers', auth, search.organizers);

// router.post('', user.create);
// router.get('', user.getAll);
// router.get('/:id', user.get);
// router.put('/users/:id', user.update);
// router.delete('/users/:id', user.delete);

module.exports = router;
