

var Twit = require('twit');
var axios=require("axios").default;
const imageToBase64=require("image-to-base64");
require('dotenv').config();

var T=new Twit({
    
        consumer_key:process.env.consumer_key,
      consumer_secret:process.env.consumer_secret,
      access_token:process.env.access_token,
      access_token_secret:process.env.access_token_secret
    
})


 
async function getmeme(id,text1,text2){
    var options = {
        method: 'POST',
        url: process.env.memeurl,
        params: {
            template_id : id,
            username:process.env.usern,
             password:process.env.password,
             text0:text1,
             text1:text2
        },
      };
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

// getmeme(87743020,"hi","hi2").then((res)=>{
//   if(!res.status) throw "error";
//   console.log("gg"+res)
// }).catch((err)=>{
//   console.log("hehe"+err)
// })



 function sorttweet(tweet){
   console.log("hehe text" +tweet.text)
    const textar=tweet.text.split("-");
  // const textar="@bot -slap 'hello' 'shutup'".split(" ");
//   console.log(textar[2].slice(1,-1));
  const textar2=textar[1].split(" ");
console.log(textar2)
// console.log(textar2.pop().slice(1,-1))
    if(textar.length>=2){
        switch(textar2[0]){
            case 'slap':
                return  {id:438680,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
                // "@SwasthikJp @respondwithmeme @respondwithmeme -confuse 'gg' 'GG'"
  
          case 'confuse':
                 return {id:87743020,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
              
  
               default:
                return  {id:438680,text2:textar2.pop().slice(1,-1),text1:textar2.pop().slice(1,-1)};
  
        }
    }
  }


 
// This function finds the latest tweet with the @respondwithmeme tag
function streamtweet() {
  

	var stream = T.stream('statuses/filter', { track: '@respondwithmeme' });
 
stream.on('tweet',async function (tweet) {
  console.log(tweet)
  console.log(tweet.entities.user_mentions);
if(tweet.user.screen_name!=="respondwithmeme"){

var obj= sorttweet(tweet);
getmeme(obj.id,obj.text1,obj.text2).then((res)=>{

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