const User = require('../models/UserModel')
const { decrypt } = require('../../routes/encyption.server')

const appUninstall = async (req, res) => {
   
    const { suid } = req.query
    const id = decrypt(suid);
    if (!id) {
        return res.status(200).send({ msg: 'Invalid request' });
    }

    const UserData = await User.findOne({ _id: id });
    if (!UserData) {
        return res.status(200).send({ msg: 'User not found' });
    }

    UserData.app_uninstall = true,
    UserData.app_uninstall_time = new Date(),
    await UserData.save()
 
    res.status(200).send({msg : "Data Added Successfully"} );
}

const themesPunblish = async (req, res) => {

    const { suid } = req.query
    const id = decrypt(suid);
    if (!id) {
        return res.status(200).send({ msg: 'Invalid request' });
    }

    const UserData = await User.findOne({ _id: id });
    if (!UserData) {
        return res.status(200).send({ msg: 'User not found' });
    }

    UserData.theme_id = req.body.admin_graphql_api_id,
    await UserData.save()
 
    res.status(200).send({id, UserData, msg : "Theme Data Added Successfully"} );
}

const shopUpdate = async (req, res) => {
    const { suid } = req.query

    const id = decrypt(suid);
    if (!id) {
        return res.status(200).send({ msg: 'Invalid request' });
    }

    const UserData = await User.findOne({ _id: id });
    if (!UserData) {
        return res.status(200).send({ msg: 'User not found' });
    }

    UserData.email = req.body.email,
    UserData.shop_name = req.body.name,
    UserData.owner_name = req.body.shop_owner,
    UserData.country_code = req.body.country_code,
    UserData.plan_displayName = req.body.plan_display_name,
    UserData.currency_code = req.body.country_code,
    UserData.currency_format = req.body.money_format,
    UserData.ianaTimezone = req.body.iana_timezone,
    await UserData.save()
 
    res.status(200).send({id, UserData, msg : "Shop Data Added Successfully"} );
}

module.exports = {
    appUninstall,
    themesPunblish,
    shopUpdate
}