import { db } from '../../backend';
import { MOCKED_USER_ID, MOCKED_SESSION_ID } from './constants';
import nodemailer from 'nodemailer';

async function sendEmail(code: string) {
  nodemailer.createTestAccount(async (err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    }

    console.log('Credentials obtained, sending message...');

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    const message = {
      from: 'admin@mfa-test.com',
      to: 'user@mfa-test.com',
      subject: 'MFA Code',
      text: `MFA Code ${code}. Please don't share it with anyone.`,
    };

    await transporter.sendMail(
      message,
      (err: Error, info: { messageId: string }) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // NOTE: access to email in Debug Console
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    );
  });
}

export async function createMfaCode() {
  const CODE_LENGTH = 6;
  const upperRandomBound = 10 ** CODE_LENGTH;
  const code = Math.floor(Math.random() * upperRandomBound)
    .toString()
    .padStart(CODE_LENGTH, '0');

  await sendEmail(code);
  const sql = `
    INSERT INTO MfaCodeRecords (user_id, session_id, code)
    VALUES (
      '${MOCKED_USER_ID}',
      '${MOCKED_SESSION_ID}',
      ${code}
    )
    ON CONFLICT(user_id, session_id) DO
    UPDATE SET
      code = ${code},
      created_time = CURRENT_TIMESTAMP
    WHERE
      user_id = '${MOCKED_USER_ID}' AND
      session_id = '${MOCKED_SESSION_ID}'
`;

  await new Promise((resolve, reject) => {
    db.run(sql, async function (err) {
      if (err) {
        return reject(console.log(err.message));
      } else {
        resolve(console.log('code created/updated successfully'));
      }
    });
  });
}
