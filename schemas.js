import mongoose from "mongoose";

function createSchemas() {
    const customerSchema = new mongoose.Schema({
        id: mongoose.Schema.Types.ObjectId,
        name: mongoose.Schema.Types.String,
        email: mongoose.Schema.Types.String,
        password: mongoose.Schema.Types.String,
        phone: mongoose.Schema.Types.Number,
        otp: mongoose.Schema.Types.Number,
        otpExpiry: mongoose.Schema.Types.Date,
        isVerified: mongoose.Schema.Types.Boolean,
        createdAt: mongoose.Schema.Types.Date,
        updatedAt: mongoose.Schema.Types.Date,
    });

    const Customer = mongoose.model("Customer", customerSchema);

    const serviceProviderSchema = new mongoose.Schema({
        id: mongoose.Schema.Types.ObjectId,
        name: mongoose.Schema.Types.String,
        email: mongoose.Schema.Types.String,
        password: mongoose.Schema.Types.String,
        phone: mongoose.Schema.Types.Number,
        otp: mongoose.Schema.Types.Number,
        otpExpiry: mongoose.Schema.Types.Date,
        isVerified: mongoose.Schema.Types.Boolean,
        createdAt: mongoose.Schema.Types.Date,
        updatedAt: mongoose.Schema.Types.Date,
    });
}