const eventService = require("../services/event.service");
const { success, error } = require("../utils/response");

exports.getEvents = async (req, res) => {
    try {

        const events = await eventService.getEvents(
            req.query.date_from,
            req.query.date_to
        );

        return success(res, {
            events,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.getEventById = async (req, res) => {
    try {

        const event = await eventService.getEventById(
            req.params.id
        );

        if (!event) {
            return error(res, "Event not found", 404);
        }

        return success(res, event);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.createEvent = async (req, res) => {
    try {

        const event = await eventService.createEvent(
            req.body
        );

        return success(res, {
            event_id: event.id,
        }, 201);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.updateEvent = async (req, res) => {
    try {

        await eventService.updateEvent(
            req.params.id,
            req.body
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.deleteEvent = async (req, res) => {
    try {

        await eventService.deleteEvent(
            req.params.id
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};