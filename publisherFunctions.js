const publish = require('./publisher').publishEvent;

exports.publishEmailEventForForgotPassword=(msg)=>{
    msg.routingKey="Email_Forgot_Password";
    return publish(msg)
}