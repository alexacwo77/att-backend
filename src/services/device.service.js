const prisma = require("../config/db");

exports.checkIn = async ({ card_id, device_id, checkin_time }) => {
    const now = checkin_time ? new Date(checkin_time) : new Date();

    return prisma.$transaction(async (tx) => {

        const device = await tx.device.findUnique({
            where: {
                id: Number(device_id)
            }
        });

        if (!device) {
            throw new Error("DEVICE_NOT_FOUND");
        }

        const locationId = device.locationId;

        const user = await tx.user.findUnique({
            where: {
                cardId: card_id
            }
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const eventUsers = await tx.eventUser.findMany({
            where: {
                userId: user.id,
                event: {
                    locationId: locationId
                }
            },
            include: {
                event: true
            }
        });

        let matched = null;
        let pointsAwarded = 0;
        let alreadyRecorded = false;

        for (const eu of eventUsers) {
            const event = eu.event;

            const open = event.openTime;
            const start = event.startTime;
            const cutoff = event.cutoffTime;

            if (!open || !start || !cutoff) continue;

            // event is not active now
            if (now < open || now > cutoff) continue;

            // attendance already recorded
            if (eu.arrivalTime) {
                alreadyRecorded = true;
                continue;
            }

            matched = eu;

            if (now <= start) {
                pointsAwarded = event.points; // 100%
            } else {
                pointsAwarded = Math.floor(event.points * 0.5); // 50%
            }

            break;
        }

        if (!matched) {
            if (alreadyRecorded) {
                throw new Error("ATTENDANCE_RECORDED");
            }

            throw new Error("EVENT_NOT_FOUND");
        }

        await tx.eventUser.update({
            where: {
                userId_eventId: {
                    userId: matched.userId,
                    eventId: matched.eventId
                }
            },
            data: {
                arrivalTime: now
            }
        });

        await tx.user.update({
            where: { id: user.id },
            data: {
                points: {
                    increment: pointsAwarded
                }
            }
        });

        return {
            event_id: matched.eventId,
            points: pointsAwarded
        };
    });
};