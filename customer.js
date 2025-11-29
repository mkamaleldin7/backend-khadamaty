import { Customer } from "./schemas.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Service } from "./schemas.js";

export async function handleSignup(req, res) {
    try {
        const { name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 60 * 1000); // 1 minute expiry
        const customer = new Customer({ name, email, password: hashedPassword, phone, otp, otpExpiry });
        await customer.save();
        console.log("DEV MODE - Generated OTP:", otp);
        res.status(201).json({ message: "Customer created successfully" });
        await sendOTP(customer.otp, customer.email); // Call the sendOTP function
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Error creating customer" });
    }
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

async function sendOTP(otp, email) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: '"Khadamaty" <' + process.env.SMTP_USER + '>',
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}`,
            html: `<b>Your OTP code is ${otp}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export async function verifyOtp(req, res) {
    try {
        const { otp } = req.body;
        const customer = await Customer.findOne({ otp: otp, otpExpiry: { $gt: Date.now() } });
        if (!customer) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        customer.isVerified = true;
        await customer.save();
        res.status(200).json({
            message: "Customer verified successfully",
            customer: customer,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
}


export async function getServices(req, res) {
    try {
        const services = await Service.find();
        res.status(200).json({ message: "Services fetched successfully", services: services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Error fetching services" });
    }
}
