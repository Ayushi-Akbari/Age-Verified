const appUninstall = async (req, res) => {
    // console.log("req.query : ", req.query);

    // console.log("req.body : ", req.body);

    console.log("hello");
    
    
    
    res.status(200).send('Webhook route is working');
}

module.exports = {
    appUninstall,
}