// describe("No of operations",()=>{
//     test("1 + 1 = 2",()=>{
//         let a = 1
//         let b = 1
//         expect(a+b).toBe(2)
//     })
//     test("5 + 6 =/= 10",()=>{
//         let a = 5
//         let b = 1;
//         expect(a+b).not.toBe(10)
//     })
// })

// describe("Test matcher",()=>{
//     test("Is undefined",()=>{
//         let a = undefined
//         expect(a).not.toBeDefined()
//         expect(a).toBeUndefined
//         expect(a).not.toBeNull()
//         expect(a).toBeFalsy()
//         expect(a).not.toBeTruthy()
//     })
// })
const User = require("../Models/User");
const { connect } = require("../database");
const express = require("express");
const request = require("supertest");
const app = express();
app.use(express.json());
app.use("/api/users", require("../Routes/userRoutes"));
const setUp = async () => {
    connect();
    await resetDb();
    console.log("Ready");
};
const cleanUp = async () => {
    await resetDb();
    console.log("CleanedUp");
};
const resetDb = async () => {
    await User.deleteMany();
};

beforeAll(async () => await setUp());
afterAll(async () => await cleanUp());

describe("test user route", () => {
    it("it is working", async () => {
        const { body, statusCode } = await request(app).get("/api/users/test");
        // console.log(body)
        expect(body.success).toBeTruthy();
        expect(statusCode).toBe(200);
    });
});

describe("Get all users", () => {
    it("Get all users", async () => {
        const { body, statusCode } = await request(app).get("/api/users/");
        console.log(body);
        expect(body.success).toBeTruthy();
        expect(body.data).toBeDefined();
        expect(statusCode).toBe(200);
    });
});

describe("add user route", () => {
    it("Successfully add user", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "Siang Meng",
                email: "sm.lee.2020@smu.edu.sg",
                password: "12345678",
            });
        console.log(body);
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeTruthy();
        // check body data --> returns ID
        expect(body.data).toBeDefined();
    });

    it("Existing email", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "Lee Siang Meng",
                email: "sm.lee.2020@smu.edu.sg",
                password: "12345678",
            });
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check body data --> should not return data
        expect(body.data).not.toBeDefined();
        // check message --> should be defined and message = "Email exists"
        expect(body.message).toBeDefined();
        expect(body.message).toBe("User exists");
    });

    it("Empty email", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "Lee Siang Meng",
                email: "",
                password: "12345678",
            });
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check body data --> should not return data
        expect(body.data).not.toBeDefined();
        // check message --> should be defined and message = "Email cannot be empty"
        expect(body.message).toBeDefined();
        expect(body.message).toBe("Please fill up all fields");
    });

    it("Empty name", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "",
                email: "zzsiangmengzz@gmail.com",
                password: "12345678",
            });
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check body data --> should not return data
        expect(body.data).not.toBeDefined();
        // check message --> should be defined and message = "Name cannot be empty"
        expect(body.message).toBeDefined();
        expect(body.message).toBe("Please fill up all fields");
    });

    it("Empty Password", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "Siang Meng",
                email: "zzisangmengzz@gmail.com",
                password: "",
            });
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check body data --> should not return data
        expect(body.data).not.toBeDefined();
        // check message --> should be defined and message = "Password must be at least 8 characters"
        expect(body.message).toBeDefined();
        expect(body.message).toBe("Please fill up all fields");
    });
    it("7 character password (need 8 char)", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/")
            .send({
                name: "Siang Meng",
                email: "zzisangmengzz@gmail.com",
                password: "1234567",
            });
        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check body data --> should not return data
        expect(body.data).not.toBeDefined();
        // check message --> should be defined and message = "Password must be at least 8 characters"
        expect(body.message).toBeDefined();
        expect(body.message).toBe("Password must be at least 8 characters");
    });
});

describe("login user", () => {
    it("User yet to verify", async () => {
        const mockUser = await request(app).post("/api/users/").send({
            name: "Karin",
            email: "karinsan@gmail.com",
            password: "12345678",
        });
        const { body, statusCode } = await request(app)
            .post("/api/users/login")
            .send({
                email: "karinsan@gmail.com",
                password: "12345678",
            });

        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check message
        expect(body.message).toBe("Pleaase verify your account!");
    });

    // it("Incorrect Password", async () => {
    //     const mockUser = await request(app).post("/api/users/").send({
    //         name: "Karin",
    //         email: "karinsan@gmail.com",
    //         password: "12345678",
    //     });
    //     const { body, statusCode } = await request(app)
    //         .post("/api/users/login")
    //         .send({
    //             email: "karinsan@gmail.com",
    //             password: "1234567a8",
    //         });

    //     // check status code
    //     expect(statusCode).toBe(200);
    //     // check success
    //     expect(body.success).toBeFalsy();
    //     // check message
    //     expect(body.message).toBe("Invalid password");
    // });

    it("Blank email", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/login")
            .send({
                email: "",
                password: "12345678",
            });

        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check message
        expect(body.message).toBe("Please fill up all the fields");
    });
    it("Blank password", async () => {
        const { body, statusCode } = await request(app)
            .post("/api/users/login")
            .send({
                email: "karinsan@gmail.com",
                password: "",
            });

        // check status code
        expect(statusCode).toBe(200);
        // check success
        expect(body.success).toBeFalsy();
        // check message
        expect(body.message).toBe("Please fill up all the fields");
    });
});

describe("change password", () => {});
