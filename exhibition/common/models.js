module.exports = {
    user:{
        name: String,
        password:String,
        email: String,
        admin:{
            type:Boolean,default:false
        }
    },
    commodity:{
        name:String,
        price:Number,
        imgSrc:String,
        sumNum:Number,
        usedNum:Number,
        existNum:Number,
        address:String,
        phone:String,
        type:String,
        detail:String,
        status : {
            type: Boolean, default: true
        }
    },
    cart:{
        uId:String,
        uName:String,
        uPhone:Number,
        uMsg:String,
        cId:String,
        cName:String,
        cPrice:Number,
        cImgSrc:String ,
        cQuantity:Number,
        cSumbitTime:Date,
        cUseTime:Date,
        cStatus :Boolean,
        cRemind:{type:Boolean,default:false}
    },
    msg:{
        phone:String,
        email:String,
        msgContent:String
    },
    remainSeat:{
        cId:String,
        date:Date,
        sumNum:Number,
        usedNum:Number,
        existNum:Number
    }
};