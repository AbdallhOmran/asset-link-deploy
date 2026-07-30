const Company = require("../models/company.model");
const Booking = require("../models/booking.model");

const getProfile = async (companyId) => {

    const company = await Company.findById(companyId);

    if (!company) {
        throw {
            statusCode: 404,
            message: "Company not found"
        };
    }

    const totalBookings = await Booking.countDocuments({
        $or: [
            { companyId: company._id },
            { ownerCompanyId: company._id }
        ]
    });

    company.password = undefined;

    return {
        ...company.toObject(),
        totalBookings
    };
};

const updateProfile = async (companyId, data) => {

    const company = await Company.findById(companyId);

    if (!company) {
        throw {
            statusCode: 404,
            message: "Company not found"
        };
    }

    if (data.companyName)
        company.companyName = data.companyName;

    if (data.displayName)
        company.displayName = data.displayName;

    if (data.companyEmail)
        company.companyEmail = data.companyEmail;

    if (data.phoneNumber)
        company.phoneNumber = data.phoneNumber;

    if (data.companyAddress)
        company.companyAddress = data.companyAddress;

    if (data.industry)
        company.industry = data.industry;

    if (data.companySize)
        company.companySize = data.companySize;

    if (data.yearFounded)
        company.yearFounded = data.yearFounded;

    if (data.website)
        company.website = data.website;

    if (data.description)
        company.description = data.description;

    if (data.city)
        company.city = data.city;

    if (data.state)
        company.state = data.state;

    if (data.zipCode)
        company.zipCode = data.zipCode;

    if (data.country)
        company.country = data.country;

    if (data.companyLogo)
        company.companyLogo = data.companyLogo;

    await company.save();

    company.password = undefined;

    return company;
};

module.exports = {
    getProfile,
    updateProfile
};  