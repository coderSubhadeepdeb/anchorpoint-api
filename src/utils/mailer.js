import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.COMPANY_EMAIL_APP_PASSWORD
  }
});

const sendContactEmail = async ({ name, email, message }) => {
    const mailOptions = {
        from: process.env.COMPANY_EMAIL,
        to: 'anchorpointdgnstudio@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    return transporter.sendMail(mailOptions);
};

export { transporter, sendContactEmail };