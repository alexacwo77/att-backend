const prisma = require("../config/db");

const toSafeDate = (value) => {
    if (!value) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [y, m, d] = value.split('-').map(Number);

        return new Date(Date.UTC(y, m - 1, d));
    }

    const [datePart, timePart] = value.split('T');

    const [y, m, d] = datePart.split('-').map(Number);
    const [h, i, s] = timePart.split(':').map(Number);

    return new Date(
        Date.UTC(
            y,
            m - 1,
            d,
            h,
            i,
            s || 0
        )
    );
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
        include: {
            location: true,
            eventUsers: {
                include: {
                    user: true,
                }
            }
        },
        orderBy: {
            date: "asc",
        }
    });
};

exports.getEventById = async (id) => {
    return prisma.event.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            location: true,
            eventUsers: {
                include: {
                    user: true,
                }
            }
        }
    });
};

exports.createEvent = async (data) => {
    return prisma.$transaction(async (tx) => {

        const event = await tx.event.create({
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

        if (Array.isArray(data.user_ids) && data.user_ids.length > 0) {
            await tx.eventUser.createMany({
                data: data.user_ids.map(userId => ({
                    eventId: event.id,
                    userId: Number(userId),
                }))
            });
        }

        return event;
    });
};

exports.updateEvent = async (id, data) => {
    return prisma.$transaction(async (tx) => {

        const eventId = Number(id);

        const event = await tx.event.update({
            where: { id: eventId },
            data: {
                location: data.location_id
                    ? {
                        connect: {
                            id: Number(data.location_id),
                        },
                    }
                    : undefined,
                name: data.name,
                date: toSafeDate(data.date),
                openTime: toSafeDate(data.open_time),
                startTime: toSafeDate(data.start_time),
                cutoffTime: toSafeDate(data.cutoff_time),
                points: data.points
            },
        });

        if (Array.isArray(data.user_ids)) {

            await tx.eventUser.deleteMany({
                where: { eventId }
            });

            if (data.user_ids.length > 0) {
                await tx.eventUser.createMany({
                    data: data.user_ids.map(userId => ({
                        eventId,
                        userId: Number(userId),
                    }))
                });
            }
        }

        return event;
    });
};

exports.deleteEvent = async (id) => {
    return prisma.$transaction(async (tx) => {

        const eventId = Number(id);

        await tx.eventUser.deleteMany({
            where: { eventId }
        });

        return tx.event.delete({
            where: { id: eventId },
        });
    });
};