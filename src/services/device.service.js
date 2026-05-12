const prisma = require("../config/db");

exports.checkIn = async ({ user_id, device_id, checkin_time }) => {
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

        const eventUsers = await tx.eventUser.findMany({
            where: {
                userId: Number(user_id),
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

        for (const eu of eventUsers) {
            const event = eu.event;

            const open = event.openTime;
            const start = event.startTime;
            const cutoff = event.cutoffTime;

            if (!open || !start || !cutoff) continue;

            if (now < open || now > cutoff) continue;

            matched = eu;

            if (now <= start) {
                pointsAwarded = event.points; // 100%
            } else {
                pointsAwarded = Math.floor(event.points * 0.5); // 50%
            }

            break;
        }

        if (!matched) {
            return {
                success: false,
                message: "No valid event found for check-in"
            };
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
            where: { id: Number(user_id) },
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