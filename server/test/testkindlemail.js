const k = require("../helpers/kindlemail");
const chai = require("chai");
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert,
    expect = chai.expect;
chai.should();
const fs = require("fs");
const filepath = __dirname + "/test.mobi";
const mockMails = ["asd@asd", "asd", "@", ".asd@asd.asd",
    "asd@asd@asd.asd", "asd@.asd"
];

describe("Input validator", () => {
    before(function () {
        fs.openSync(filepath, "w");
    });

    after(function () {
        fs.unlinkSync(filepath, "w");
    });
    mockMails.map(elem => {
        it("checks if user email is valid", () => {
            return k.send({
                to: "valid@email.com",
                sender: {
                    user: elem,
                    pass: "pass"
                },
                filePath: filepath
            }).should.eventually.be.rejectedWith("Email is not valid");
        });
        it("checks if recipient email is valid", () => {
            return k.send({
                to: elem,
                sender: {
                    user: "valid@email.com",
                    pass: "pass"
                },
                filePath: filepath
            }).should.eventually.be.rejectedWith("Email is not valid");
        });
    });
    it("checks if file exists", () => {
        return k.send({
            to: "valid@email.com",
            sender: {
                user: "valid@email.com",
                pass: "pass"
            },
            filePath: "invalid.mobi"
        }).should.eventually.be.rejectedWith("File not found!");
    });
    it("should fail with invalid user pass combinations", () => {
        return k.send({
            to: "valid@email.com",
            sender: {
                user: "valid@email.com",
                pass: "pass"
            },
            filePath: filepath
        }).should.eventually.be.rejectedWith("ECONNREFUSED");
    });
});
