import { sendContactEmail } from '../utils/mailer.js';

const handleContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Name, email, and message are required' 
            });
        }

        await sendContactEmail({ 
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
        });
    
        res.status(200).json({ 
            success: true,
            message: 'Message sent successfully',
            data: {
                name,
                email
            } 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: 'Email Sending Failed',
            message: "We encountered an issue while sending your message. Please try again later"
        });
    }
};

export { handleContactForm };