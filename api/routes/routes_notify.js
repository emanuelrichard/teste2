const express = require('express');
const router = express.Router();

const Notification = require('../notifications/notifications')

/* ************************* NOTIFY ************************ */
/**
 * NOTIFY - notify a single user about something
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/notify', (request, response) => {
    console.log("veio pro POST de NOTIFY")
    let token = request.body.registrationToken
    let title = request.body.title
    let body = request.body.body
    let image = request.body.image
    
    Notification.notify(token, title, body, image, response)
})

/**
 * NOTIFY TOPIC - Notify all users inside a topic
 * @param  {Request} request    Request info
 * @param  {Response} response  Response object
 */
router.post('/notifyTopic', (request, response) => {
    console.log("veio pro POST de NOTIFY TOPIC")
    let topic = request.body.topic
    let title = request.body.title
    let body = request.body.body
    let image = request.body.image
    
    Notification.notifyTopic(topic, title, body, image, response)
})

module.exports = router;
