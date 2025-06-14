import transporter from "../config/mail.config.js";

export const sendContactEmail = (req, res) => {
    const { FirstName, LastName, email, message } = req.body;

    const mailOptions = {
        from: `"${FirstName} ${LastName}" <${email}>`,
        to: "nishantapro@gmail.com",
        subject: "New message from client",
        text: message,
        html: `<p>First Name: ${FirstName}</p>
               <p>Last Name: ${LastName}</p>
               <p>Email: ${email}</p>
               <p>Message: ${message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending email" });
        }
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Email sent successfully" });
    });
};
