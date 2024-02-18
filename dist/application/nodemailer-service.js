"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodemailerService = void 0;
const nodemailer = require("nodemailer");
exports.nodemailerService = {
    send(confirmationCode, emailToSend) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = yield nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "robersargsyan2023@gmail.com",
                        pass: "vqcubthqzapwnboe",
                    },
                });
                const info = yield transporter.sendMail({
                    from: '"Fred Foo 👻" <robersargsyan2023@gmail.com>',
                    to: emailToSend,
                    subject: "Hello ✔",
                    text: `Hello world?`,
                    html: ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>
`,
                });
                return true;
            }
            catch (err) {
                console.error('Ошибка в отправке писем: ', err.body.responseCode);
                return false;
            }
        });
    }
};
//# sourceMappingURL=nodemailer-service.js.map