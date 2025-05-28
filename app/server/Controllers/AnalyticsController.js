const Analytics = require('../models/AnalyticsModel');
const User = require('../models/UserModel');

const addAnalytics = async (req, res) => {
    const {verified, shop} = req.body;
    if (!shop) {
        return res.status(400).json({ error: "Shop Name is required." });
    }

    let UserData = await User.findOne({ host: shop });
    if (!UserData) {
        return res.status(404).json({ error: "Shop not found." });
    }

    if (verified === undefined ) {
        return res.status(400).json({ error: "Verified and Unverified counts are required." });
    }

    let type = verified ? 'verified' : 'unverified';
    const currentTime = new Date();

    const AnalyticsData = await Analytics.findOne({ shop_id: UserData._id });

    let update = {};
    if (!AnalyticsData) {
        update = {
          shop_id: UserData._id,
          [type]: [
            {
              time: currentTime,
              count: 1,
            },
          ],
        };

        await Analytics.create(update);
    }else{
        const existingEntry = AnalyticsData[type]?.find((entry) => {
            const entryDate = new Date(entry.time.toDateString());
            const currentDateOnly = new Date(currentTime.toDateString());
          return entryDate.getTime() === currentDateOnly.getTime();
        });

        if(existingEntry){
            existingEntry.count += 1;
        }else{
            AnalyticsData[type].push({
                time: currentTime,
                count: 1
            });
        }  
        
        await AnalyticsData.save();
    }
    
    res.status(200).json({data : "result" , msg: "Analytics Data Added Successfully." });
}

const getAnalytics = async (req, res) => {
    const { shop, date_range } = req.query;

    if (!shop) {
        return res.status(400).json({ msg: "Shop ID is required." });
    }

    const UserData = await User.findOne({ host: shop });
    if (!UserData) {
        return res.status(404).json({ msg: "Shop not found." });
    }
    let startDate, endDate;

    if (date_range) {
    const today = new Date();
    endDate = new Date();

    if(date_range.includes('/')) {
        const [start, end] = date_range.split('/');
        startDate = new Date(start);
        endDate = new Date(end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ msg: "Invalid date format. Use YYYY-MM-DD." });
        }

        if (startDate > endDate) {
            return res.status(400).json({ msg: "Start date cannot be after end date." });
        }
    }else {
        switch (date_range) {
        case 'last_7_days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;

        case 'last_30_days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;

        case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;

        case 'next_month':
        startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        break;

        default:
        return res.status(400).json({ msg: "Invalid date range." });
    }
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    }

    let analyticsDetail = await Analytics.findOne({ shop_id: UserData._id });

    if (!analyticsDetail) {
        return res.status(404).json({ msg: "Analytics data not found for this shop." });
    }

    let analyticsData;

    if(startDate && endDate) {
        const VerifiedTimes = analyticsDetail.verified.filter((date) => date.time >=startDate && date.time <= endDate)
        const UnverifiedTimes = analyticsDetail.unverified.filter((date) => date.time >=startDate && date.time <= endDate)
        const verifiedCount = VerifiedTimes.reduce((total, entery) => total + entery.count, 0)
        const unverifiedCount = UnverifiedTimes.reduce((total, entery) => total + entery.count, 0)
        analyticsData = {
            shop_id: analyticsDetail.shop_id,
            verified_count: verifiedCount,
            verified_times: VerifiedTimes,
            unverified_count: unverifiedCount,
            unverified_times: UnverifiedTimes,
            total_verification: verifiedCount + unverifiedCount
        }
    }else{
        const verifiedCount = analyticsDetail.verified.reduce((total, entery) => total + entery.count, 0)
        const unverifiedCount = analyticsDetail.unverified.reduce((total, entery) => total + entery.count, 0)
        analyticsData = {
            shop_id: analyticsDetail.shop_id,
            verified_count: verifiedCount,
            verified_times: analyticsDetail.verified,
            unverified_count: unverifiedCount,
            unverified_times: analyticsDetail.unverified,
            total_verification: verifiedCount + unverifiedCount
       }
    }
    
    res.status(200).json({analyticsData, msg: "Analytics Data Retrieved Successfully." });
}

module.exports = {
    addAnalytics,
    getAnalytics
};