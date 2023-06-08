module.exports = async function auth(req, res, next) {
    const jwt = require('jsonwebtoken')
    const Student = require('../models/student_model')
    const Token = require('../models/token_model')
    try {
        //console.log(req.headers);
        const token = req.cookies.token;
        // const token2 = await req.headers['authorization'].split(' ')[1]
        // console.log(token);
        if (token == null) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: "Lütfen Tekrar Giriş Yapın!"
            })
        }
        const isToken = Token.findOne({ token: token }, async(err, docs) => {
            if (err) {
                res.json(err);
            } else if (docs) {
                res.status(401).json({
                    success: false,
                    code: 401,
                    message: "Çıkış yaptığınız tokenle giremezsiniz."
                })
            } else {
                const sonuc = jwt.verify(token, 'supersecret')
                if (sonuc == "hata") {
                    res.redirect('/signInStudent')
                } else {
                    //console.log(sonuc);
                    const bulunan = await Student.findById(sonuc.id)
                    req.user = bulunan
                    next()
                }


            }
        })

    } catch (err) {
        if (err.message == 'invalid signature') {
            res.status(401).json({
                success: false,
                code: 401,
                message: "Belirtilen token hatalı."
            })
        } else if (err.name == 'TokenExpiredError') {
            res.redirect('/aignInStudent')
            res.status(401).json({
                success: false,
                code: 401,
                message: "Token tüketim tarihini doldurmuştur."
            })
        } else {
            console.log(err);
            res.status(401).json({
                success: false,
                code: 401,
                message: "Sistemin bilmediği bir hata oluştu."
            })
        }

    }
}