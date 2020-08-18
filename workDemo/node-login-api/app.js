let express = require('express')

//got模块，相当于前台的ajax功能
let got = require('got')

let app = express()


app.get('/login',(req,res)=>{

    //  req.query.code

    let js_code = req.query.code //这是小程序进行登录临时的code  5分钟
    //3 . auth.code2session接口，进行解密code。获取此小程序用户的id
        //https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    let appid = 'wxc1cd3ff731f291db'
    let secret = '91dba868d644dc32a143e2176ba30af9' //此小程序appid的密钥  从小程序后台 。
    let code2sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`

    // res.send( code2sessionUrl )
    ;(async () => {
        try {
            const response = await got( code2sessionUrl );//发送got请求
            //console.log(typeof );
            let result = JSON.parse( response.body )
            res.send({
                token:"a54dsf6"+result.openid + 'woshiyigesuozi'
            })// openid  session_key(解密敏感数据)
            //=> '<!doctype html> ...'
        } catch (error) {
            //console.log(error.response.body);
            //=> 'Internal server error ...'
            res.send(error.response.body)
        }
    })()
})


app.get('/checklogin',(req,res)=>{
    //req.query.openid + 'woshiyigesuozi'
})

app.listen(3000)


//https://api.weixin.qq.com/sns/jscode2session?appid=wx5a218a6eb0764444&secret=11d8716a74a028c837b36503aaebf562&js_code=081QKU1o0N46cm1QKJ2o0ysU1o0QKU1K&grant_type=authorization_code
//https://api.weixin.qq.com/sns/jscode2session?appid=wx5a218a6eb0764444&secret=11d8716a74a028c837b36503aaebf562&js_code=021bbV5v1zguYg064O5v1EqV5v1bbV5Z&grant_type=authorization_code