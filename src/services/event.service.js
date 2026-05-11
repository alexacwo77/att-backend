const prisma = require("../config/db");

const toSafeDate = (value) => {
    if (!value) return null;

    const normalized = value.replace(' ', 'T');

    const date = new Date(normalized);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${value}`);
    }

    return date;
};

exports.getEvents = async (dateFrom, dateTo) => {

    const where = {};

    if (dateFrom && dateTo) {
        where.date = {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
        };
    }

    return prisma.event.findMany({
        where,
    });
};

exports.getEventById = async (id) => {
    return prisma.event.findUnique({
        where: {
            id: Number(id),
        },
    });
};

exports.createEvent = async (data) => {
    return prisma.event.create({
        data: {
            location: {
                connect: {
                    id: Number(data.location_id),
                },
            },
            name: data.name,
            date: toSafeDate(data.date),
            openTime: toSafeDate(data.open_time),
            startTime: toSafeDate(data.start_time),
            cutoffTime: toSafeDate(data.cutoff_time),
            points: data.points
        },
    });
};

exports.updateEvent = async (id, data) => {
    const priority = Number(data.priority);

    return prisma.event.update({
        where: {
            id: Number(id),
        },
        data: {
            location: {
                connect: {
                    id: Number(data.location_id),
                },
            },
            name: data.name,
            date: toSafeDate(data.date),
            openTime: toSafeDate(data.open_time),
            startTime: toSafeDate(data.start_time),
            cutoffTime: toSafeDate(data.cutoff_time),
            points: data.points,
        },
    });
};

exports.deleteEvent = async (id) => {
    return prisma.event.delete({
        where: {
            id: Number(id),
        },
    });
};