import fs from 'fs';
import mustache from 'mustache';
import {
  dirname,
  join,
} from 'path';
import { fileURLToPath } from 'url';

import transporter from '../configs/nodemailer.js';

const sendForgotPass = ({ to, subject, url }) => {
  const data = { to, subject, url };
  const currentFileUrl = import.meta.url;
  const currentFilePath = fileURLToPath(currentFileUrl);
  const templatesPath = join(
    dirname(currentFilePath),
    "./templates/forgotpass.html"
  );

  const templates = fs.readFileSync(templatesPath, "utf8");
  const mailOptions = {
    from: "no-reply <no-reply@efbewe.com>",
    to: data.to,
    subject: "Reset Password for jokopi account",
    text: `Hey dude!, seems you requested new password, here new link :${url}./ If you are not request this, just ignore it.`,
    html: mustache.render(templates, { ...data }),
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
};

export default sendForgotPass;