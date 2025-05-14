const { use } = require("react");
const db = require("../models/Config/config")
const User = db.user
const addSetting = async (req,res) => {
    const {name} = req.query

    console.log("name : ", name);
    

    const {age, title, description, acceptButton, rejectButton } = req.body

    let setting= {
        age,
        title,
        description,
        acceptButton,
        rejectButton
    }
    
    console.log("req.file : " , req.file);
    if(req?.file){
        setting.image = `/image/${req.file.filename}`
    }

    console.log("setting : " ,setting);
    

    if(!name){
        res.status(400).json({ msg: "Store id is not found." });
    }

    const user = await User.findOne({
        where : {store_name : name}
    })

    if(user) {
        const data = await User.update({
            settings: setting
        },{
            where: {
                id : user.id
            }
        }
    )    
    console.log("data : " , data);
    
    }else{
        const userSetting = await User.create({
            store_name: name,
            settings: setting
        })

        console.log("user stting : " ,userSetting);
        
    }
    res.status(200).json({ msg: "App Setings added Successfully." });
}

const getSetting = async (req,res) => {
    const {name} = req.query

    if(!name){
        res.status(400).json({ msg: "Store id is not found." });
    }

    const user = await User.findOne({
        where : {store_name : name}
    })

    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }

    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user});

}

module.exports = {addSetting, getSetting}