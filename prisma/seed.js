const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    // For development purposes, salt 8 is ok
    const userPassword = await bcrypt.hash(
        "DTAP_team6",
        8
    );

    const adminPassword = await bcrypt.hash(
        "DTAPteam6_",
        8
    );

    await prisma.role.createMany({
        data: [
            { id: 1, name: "admin" },
            { id: 2, name: "employee" },
        ],
        skipDuplicates: true,
    });

    await prisma.user.createMany({
        data: [
            {
                name: "Aino Korhonen",
                nickname: "Big Boss",
                email: "team6.dtap26@gmail.com",
                password: adminPassword,
                roleId: 1,
                points: 0
            },
            {
                name: "Mikko Virtanen",
                nickname: "Aku Ankka",
                email: "dtap.user@gmail.com",
                password: userPassword,
                roleId: 2,
                points: 1500
            },
            {
                name: "Matti Meikalainen",
                nickname: "Mickey Mouse",
                email: "matti.meikalainen@example.com",
                password: userPassword,
                roleId: 2,
                points: 980
            },
            {
                name: "Liisa Laine",
                nickname: "Donald Duck",
                email: "liisa.laine@example.com",
                password: userPassword,
                roleId: 2,
                points: 1120
            },
            {
                name: "Kalle Korhonen",
                nickname: "Goofy Goof",
                email: "kalle.korhonen@example.com",
                password: userPassword,
                roleId: 2,
                points: 450
            }
        ],
        skipDuplicates: true,
    });

    await prisma.rewardType.createMany({
        data: [
            { id: 1, name: "voucher" },
            { id: 2, name: "food" },
            { id: 3, name: "experience" },
            { id: 4, name: "merch" },
        ],
        skipDuplicates: true,
    });

    await prisma.location.create({
        data: {
            id: 1, name: "Meeting Room"
        }
    });

    await prisma.device.create({
        data: {
            location: {
                connect: {
                    id: 1
                }
            }
        }
    });

    await prisma.picture.createMany({
        data: [
            ...Array.from({ length: 20 }, (_, i) => ({
                fileName: `/user_avatars/${i + 1}.svg`,
                type: 'USER_AVATAR',
            })),
            ...Array.from({ length: 20 }, (_, i) => ({
                fileName: `/reward_avatars/${i + 1}.svg`,
                type: 'REWARD_AVATAR',
            })),
        ],
    })

    console.log("Seed completed");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });