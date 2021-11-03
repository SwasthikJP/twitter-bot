

var Twit = require('twit');
var axios=require("axios").default;
const imageToBase64=require("image-to-base64");
require('dotenv').config({path:`.env`});
const {sorttweet}=require("./modules/sorttweet.js");


var T=new Twit({
    
        consumer_key:process.env.consumer_key,
      consumer_secret:process.env.consumer_secret,
      access_token:process.env.access_token,
      access_token_secret:process.env.access_token_secret
    
})


async function getmemeurl(obj){

    var options = {
        method: 'POST',
        url: process.env.memeurl
      };
      var params={
        template_id : obj.id,
        username:process.env.usern,
         password:process.env.password,
         text0:" ",
         text1:" "
        //  'boxes[0][text]' :text0,
    };
obj.textar.forEach((ele,index)=>{
 params[`boxes[${index}][text]`]=ele;
});

options['params']=params;

      var url=null;
      try{
    var response=await axios.request(options);
if(response.data.success===false) throw response.data.error_message;
         url=response.data.data.url;
         console.log(url);
         return {status:true,url:url};
    //   })
    }catch(err){
        console.log(err);
        return  {status:false,url:""};
    }
     
}



// This function finds the latest tweet with the @respondwithmeme tag
function streamtweet() {
  

	var stream = T.stream('statuses/filter', { track: '@'+process.env.bottag });
 
stream.on('tweet',async function (tweet) {
  console.log(tweet)
  console.log(tweet.entities.user_mentions);
if(tweet.user.screen_name!==process.env.bottag){

var obj= sorttweet(tweet);
if(obj.status){
getmemeurl(obj).then((res)=>{

  if(!res.status) throw "error";
console.log("hehe"+res.url)
var mm=null;
imageToBase64(res.url) // Image URL
.then(
    (response) => {
        mm=response;


//   var b64content = fs.readFileSync('./images/meme1.jpg', { encoding: 'base64' });

  T.post('media/upload', { media_data:mm}, function (err, data, response) {
    var mediaIdStr = data.media_id_string
    var altText = "meme"
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText },
 }
   
console.log("heeeeee"+tweet.id_str);
    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: getusernames(tweet.user.screen_name,tweet.entities.user_mentions) ,
        media_ids:[mediaIdStr],
        in_reply_to_status_id:''+ tweet.id_str
     }
   
        T.post('statuses/update', params, function (err, data, response) {
          console.log(data)
        })
      }
    })
  });

// T.post('statuses/update', {
//     status: 'This is a tweet @' + tweet.user.screen_name,
//     in_reply_to_status_id: '' + tweet.id_str
//   }, function(err, data, response) {
//     console.log(data)
//   });

}
)
.catch(
    (error) => {
        console.log("hehes"+error); // Logs an error if there was one
    }
)
})
.catch((err)=>{
  console.log("meme error"+err);
});
}
}
}
);
}


// sorttweet(tweet);



function getusernames(muser,users){
//  var tags='@'+users.shift().screen_name;
//  users.pop();
users.pop();
var tags='@'+muser+" ";
tags=tags+users.map((ele)=>'@'+ele.screen_name).join(" ");
 
 console.log(tags)
 return tags;
}

// getusernames(users)

streamtweet();

function streamdm() {
  
try{
	var stream = T.stream('user');
 
// stream.on('direct_message', function (tweet) {

// console.log(tweet)

// }
// );
console.log(stream)
}
catch(er){
  console.log(er);
}

}

// streamdm();