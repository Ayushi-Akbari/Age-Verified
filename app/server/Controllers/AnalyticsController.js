const Analytics = require('../models/AnalyticsModel');
const User = require('../models/UserModel');
const Market = require("../models/MarketModel")

const addAnalytics = async (req, res) => {
    const {verified, shop, country, language} = req.body;
    if (!shop) {
        return res.status(400).json({ error: "Shop Name is required." });
    }

    let UserData = await User.findOne({ host: shop });
    if (!UserData) {
        return res.status(404).json({ error: "Shop not found." });
    }

    const market = await Market.findOne({shop_id : UserData._id})
    const marketIdObj =
        market.market.find(m => m.country === country && m.language === language) ||
        market.market.find(m => m.primary);
    
    const marketId = marketIdObj ? marketIdObj._id : null;

    if (verified === undefined ) {
        return res.status(400).json({ error: "Verified and Unverified counts are required." });
    }

    let type = verified ? 'verified' : 'unverified';
    const currentTime = new Date();

    const AnalyticsData = await Analytics.findOne({ shop_id: UserData._id });

    if (!AnalyticsData) {
        await Analytics.create({
            shop_id: UserData._id,
            market: {
                id: marketId,
                [type]: [
                    {
                    time: currentTime,
                    count: 1,
                    },
                ],
            }
        });
    }else{
        const isMarket = AnalyticsData.market.find((market) => market.id.toString() === marketId.toString());
        

        if(isMarket){
            const existingEntry = isMarket[type]?.find((entry) => {
                
            const entryDate = new Date(entry.time);
            const currentDate = new Date(currentTime);
            
            return (
                entryDate.getFullYear() === currentDate.getFullYear() &&
                entryDate.getMonth() === currentDate.getMonth() &&
                entryDate.getDate() === currentDate.getDate()
            );
            });


            if (existingEntry) {
            existingEntry.count += 1;
            } else {
            isMarket[type].push({
                time: currentTime,
                count: 1,
            });
            }
  
        }else{
            const data = {
                id: marketId,
                [type]: [
                    {
                    time: currentTime,
                    count: 1,
                    },
                ],
            }

            AnalyticsData.market.push(data)
        }
        
        await AnalyticsData.save();
    }
    
    res.status(200).json({data : "result" , msg: "Analytics Data Added Successfully." });
}

const getAnalytics = async (req, res) => {
    const { shop, date_range, market_id } = req.query;

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

        case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

        default:
        return res.status(400).json({ msg: "Invalid date range." });
    }
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    }

    const market = await Market.findOne({shop_id : UserData._id})
    if (!market) {
        return res.status(404).json({ msg: "Market not found for this shop." });
    }
    const marketIdObj = market.market.find(m => m._id.toString() === market_id.toString())
    const marketId = marketIdObj ? marketIdObj._id : null;

    let analytics = await Analytics.findOne({ shop_id: UserData._id });

    let analyticsDetail
    if (analytics) {
        analyticsDetail = analytics.market.find((market) => market.id.toString() === marketId.toString())
    }

    let analyticsData;
    if(!analytics || !analyticsDetail){       
        const resultMap = {};
        while (startDate <= endDate) {
        const date = new Date(startDate);
        const dateStr = `${date.getDate().toString().padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" })}`;
        if (!resultMap[dateStr]) {
            resultMap[dateStr] = { date: dateStr, Verified: 0, Unverified: 0 };
        }
        startDate.setDate(startDate.getDate() + 1);
        }

        const combinedData = Object.values(resultMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
        );

        analyticsData = {
            shop_id: UserData._id,
            verified_count: 0,
            unverified_count: 0,
            data: combinedData,
            total_verification: 0
        }       
    }else{
        
        const VerifiedTimes = analyticsDetail.verified.filter((date) => date.time >=startDate && date.time <= endDate)
        const UnverifiedTimes = analyticsDetail.unverified.filter((date) => date.time >=startDate && date.time <= endDate)
        const verifiedCount = VerifiedTimes.reduce((total, entery) => total + entery.count, 0)
        const unverifiedCount = UnverifiedTimes.reduce((total, entery) => total + entery.count, 0)

        const verified = VerifiedTimes || [];
        const unverified = UnverifiedTimes || [];

        const resultMap = {};

        verified.forEach(({ time, count }) => {
        const date = new Date(time);
        const dateStr = `${date.getDate().toString().padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" })}`;
        if (!resultMap[dateStr]) resultMap[dateStr] = { date: dateStr, Verified: 0, Unverified: 0 };
        resultMap[dateStr].Verified += count;
        });

        unverified.forEach(({ time, count }) => {
        const date = new Date(time);
        const dateStr = `${date.getDate().toString().padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" })}`;
        if (!resultMap[dateStr]) resultMap[dateStr] = { date: dateStr, Verified: 0, Unverified: 0 };
        resultMap[dateStr].Unverified += count;
        });

        while (startDate <= endDate) {
        const date = new Date(startDate);
        const dateStr = `${date.getDate().toString().padStart(2, "0")}-${date.toLocaleString("en-US", { month: "short" })}`;
        if (!resultMap[dateStr]) {
            resultMap[dateStr] = { date: dateStr, Verified: 0, Unverified: 0 };
        }
        startDate.setDate(startDate.getDate() + 1);
        }

        const combinedData = Object.values(resultMap).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
        );

        analyticsData = {
            shop_id: UserData._id,
            verified_count: verifiedCount,
            unverified_count: unverifiedCount,
            data: combinedData,
            total_verification: verifiedCount + unverifiedCount
        }
    }      
    
    res.status(200).json({analyticsData, msg: "Analytics Data Retrieved Successfully." });
}

module.exports = {
    addAnalytics,
    getAnalytics
};